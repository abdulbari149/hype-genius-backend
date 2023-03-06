import { plainToInstance } from 'class-transformer';
import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import UserEntity from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import CreateUserDto from './dto/create-user.dto';
import { RoleEntity } from '../roles/entities/role.entity';
import { hash } from 'bcryptjs';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  public async getUsers() {
    return this.userRepository.find();
  }

  public async create(data: CreateUserDto) {
    const [role, user, hashedPassword] = await Promise.all([
      this.roleRepository.findOneBy({ role: data.role }),
      this.userRepository.findOneBy({ email: data.email }),
      hash(data.password, 10),
    ]);
    if (user) {
      throw new ConflictException('User already exists');
    }
    const user_entity = plainToInstance(UserEntity, {
      ...data,
      password: hashedPassword,
      roleId: role.id,
    });
    await this.userRepository.save(user_entity);
    return { ...user_entity, password: undefined };
  }
}
