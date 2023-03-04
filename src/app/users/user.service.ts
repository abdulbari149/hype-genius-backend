import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import UserEntity from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  public async getUsers() {
    return this.userRepository.find();
  }
}
