import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import AuthService from './auth.service';
import ResponseEntity from 'src/helpers/ResponseEntity';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';

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
      return new ResponseEntity(user_info, 'success');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
