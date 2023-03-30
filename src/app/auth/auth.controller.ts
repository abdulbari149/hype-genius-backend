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
import { Request, Response as ExpressResponse } from 'express';
import UserEntity from '../users/entities/user.entity';
import { Public } from 'src/decorators/public.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import AuthMeResponse from './dto/auth-me-response.dto';

@Controller({
  path: '/auth',
  version: '1',
})
export default class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
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
    return new ResponseEntity(result, 'Business Registered successfully');
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('/channel/:token')
  async RegisterChannel(
    @Body() data: AuthRegisterChannelDto,
    @Param('token') token: string,
  ) {
    const payload = await this.authService.validateToken(
      token,
      'thisisabusinesssecret',
    );
    if (!payload.businessId) throw new ForbiddenException('Malformed Token');
    const result = await this.authService.registerChannel(data, payload);
    return new ResponseEntity(result, 'Influencer Registered Successfully');
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
