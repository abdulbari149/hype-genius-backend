import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import UserService from './user.service';
import CreateUserDto from './dto/create-user.dto';
import ResponseEntity from 'src/helpers/ResponseEntity';

@Controller({
  path: '/users',
  version: '1',
})
export default class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getUsers() {
    return this.userService.getUsers();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  async createUser(@Body() body: CreateUserDto) {
    const result = await this.userService.create(body);
    return new ResponseEntity(result, 'User created successfully');
  }
}
