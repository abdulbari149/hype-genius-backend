import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import UserService from './user.service';

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
  @Post()
  async createUser() {
    // this.userService.create();
  }
}
