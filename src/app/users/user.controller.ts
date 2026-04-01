import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import UserService from './user.service';
import CreateUserDto from './dto/create-user.dto';
import ResponseEntity from 'src/helpers/ResponseEntity';
import { Payload } from 'src/decorators/payload.decorator';
import { JwtAccessPayload } from '../auth/auth.interface';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @HttpCode(HttpStatus.OK)
  @Put('/')
  async updateUser(
    @Body() body: UpdateUserDto,
    @Payload() payload: JwtAccessPayload,
  ) {
    const result = await this.userService.updateUser(payload.user_id, body);
    return new ResponseEntity(result, 'User updated successfully');
  }
}
