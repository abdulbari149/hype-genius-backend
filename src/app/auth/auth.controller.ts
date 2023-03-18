import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import AuthService from './auth.service';
import ResponseEntity from 'src/helpers/ResponseEntity';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import AuthRegisterBusinessDto from './dto/auth-register-business.dto';
import AuthRegisterChannelDto from './dto/auth-register-channel.dto';

@Controller({
  path: '/auth',
  version: '1',
})
export default class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async Login(@Body() data: AuthEmailLoginDto) {
    try {
      const user_info = await this.authService.Login(data);
      return new ResponseEntity(user_info, 'login successful');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/business')
  async RegisterBusiness(@Body() data: AuthRegisterBusinessDto) {
    const result = await this.authService.RegisterBusiness(data);
    return new ResponseEntity(result, 'Business Registered successfully');
  }

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
    const result = await this.authService.RegisterChannel(
      data,
      payload?.businessId,
    );
    return new ResponseEntity(result, 'Influencer Registered Successfully');
  }
}
