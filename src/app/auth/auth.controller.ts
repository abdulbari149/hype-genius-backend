import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Response,
} from '@nestjs/common';
import AuthService from './auth.service';
import ResponseEntity from 'src/helpers/ResponseEntity';
import AuthRegisterBusinessDto from './dto/auth-register-business.dto';
import AuthRegisterChannelDto from './dto/auth-register-channel.dto';
import { Request, Response as ExpressResponse, response } from 'express';
import UserEntity from '../users/entities/user.entity';
import { Public } from 'src/decorators/public.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import AuthMeResponse from './dto/auth-me-response.dto';
import ChannelService from '../channels/channels.service';
import BusinessService from '../business/business.service';

@Controller({
  path: '/auth',
  version: '1',
})
export default class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private channelService: ChannelService,
    private businessService: BusinessService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async Login(
    @Req() req: Request,
    @Body() data: AuthEmailLoginDto,
    @Response() res: ExpressResponse,
  ) {
    const result = await this.authService.login(data);
    res.cookie('refresh-token', result.refresh_token, {
      httpOnly: true,
      maxAge: 365 * 60 * 60 * 24,
      sameSite: 'strict',
      secure: false,
      path: '/',
    });
    res
      .status(HttpStatus.OK)
      .json(new ResponseEntity(result, 'Login successful'));
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('/business')
  async RegisterBusiness(
    @Body() data: AuthRegisterBusinessDto,
    @Response() res: ExpressResponse,
  ) {
    const result = await this.authService.registerBusiness(data);
    console.log(parseInt(this.configService.get('jwt.refresh.expiresIn'), 10));
    res.cookie('refresh-token', result.refresh_token, {
      httpOnly: true,
      maxAge: 60 * 60,
      sameSite: 'none',
      secure: true,
      path: '/',
    });
    res
      .status(HttpStatus.CREATED)
      .json(new ResponseEntity(result, 'Business Registered successfully'));
  }

  @Public()
  @Post('/channel/:token')
  async RegisterChannel(
    @Body() data: AuthRegisterChannelDto,
    @Param('token') token: string,
    @Response() res: ExpressResponse,
  ) {
    const payload: {
      businessId: number | undefined;
      onboardingId: number | undefined;
    } = await this.authService.validateToken(
      token,
      this.configService.get('jwt.onboarding_first.secret'),
    );
    if (typeof payload?.businessId === 'undefined') {
      throw new ForbiddenException('Malformed Token');
    }
    const result = await this.authService.registerChannel(data, payload);
    let status = HttpStatus.CREATED;
    if (result.isRedirect) {
      status = HttpStatus.PERMANENT_REDIRECT;
    }
    res
      .status(status)
      .json(new ResponseEntity(result.data, result.message, status));
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('channel/:token/verify')
  async validateChannelToken(@Param('token') token: string) {
    const payload = await this.authService.validateToken<{
      businessId: number;
      onboardingId?: number;
    }>(token, this.configService.get('jwt.onboarding_first.secret'));

    const business = await this.businessService.getBusiness(payload.businessId);
    return new ResponseEntity(
      { name: business.name },
      'The token is valid',
      HttpStatus.OK,
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('/onboarding/:token')
  async getPartnerShips(@Param('token') token: string) {
    const payload = await this.authService.validateSecondOnboardingToken(token);
    const [currentPartnerShips, newPartnerShip] = await Promise.all([
      this.channelService.getPartnerShips(payload.userId),
      this.businessService.getBusiness(payload.businessId),
    ]);
    const data = {
      currentPartnerShips,
      newPartnerShip,
    };
    return new ResponseEntity(data, 'Onboarding Partnerships', HttpStatus.OK);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('/onboarding/:token')
  async onboardNewPartnerShop(@Param('token') token: string) {
    const payload = await this.authService.validateSecondOnboardingToken(token);
    const data = await this.authService.onboardNewPartner(payload);
    return new ResponseEntity(data, 'Onboarding Partnerships', HttpStatus.OK);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/me')
  public async Me(@CurrentUser() user: Partial<UserEntity>) {
    const result = plainToInstance(AuthMeResponse, {
      user: {
        ...user,
        role: user.role.role,
      },
    });
    return new ResponseEntity(result);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  public async RefreshToken(@Req() req: Request) {
    const token = req.headers.authorization;
    if (!token) {
      throw new BadRequestException('Refresh token is required');
    }
    if (typeof token !== 'string' || !token.startsWith('Bearer ')) {
      throw new BadRequestException('Invalid Token');
    }
    const access_token = await this.authService.RefreshToken(
      token.replace('Bearer ', ''),
    );
    return new ResponseEntity({ access_token });
  }
}
