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
  UseGuards,
} from '@nestjs/common';
import AuthService from './auth.service';
import ResponseEntity from 'src/helpers/ResponseEntity';
import AuthRegisterBusinessDto from './dto/auth-register-business.dto';
import AuthRegisterChannelDto from './dto/auth-register-channel.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import UserEntity from '../users/entities/user.entity';
import { Public } from 'src/decorators/public.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import AuthMeResponse from './dto/auth-me-response.dto';

@Controller({
  path: '/auth',
  version: '1',
})
export default class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async Login(@Req() req: Request, @Body() data: AuthEmailLoginDto) {
    try {
      const result = await this.authService.login(data);
      return new ResponseEntity(result, 'Login successful');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('/business')
  async RegisterBusiness(@Body() data: AuthRegisterBusinessDto) {
    const result = await this.authService.registerBusiness(data);
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
    const result = await this.authService.registerChannel(
      data,
      payload?.businessId,
    );
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
  @Get('/refresh')
  public async RefreshToken(@Req() req: Request) {
    const token = req.header['Authorization'];
    if (!token) {
      throw new BadRequestException('Refresh token is required');
    }
    if (typeof token !== 'string' || !token.startsWith('Bearer ')) {
      throw new BadRequestException('Invalid Token');
    }
    const result = await this.authService.RefreshToken(
      token.replace('Bearer ', ''),
    );
    return new ResponseEntity(result);
  }
}
