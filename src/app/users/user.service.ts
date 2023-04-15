import { plainToInstance } from 'class-transformer';
import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import UserEntity from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import CreateUserDto from './dto/create-user.dto';
import { RoleEntity } from '../roles/entities/role.entity';
import { hash } from 'bcryptjs';
import ROLES from 'src/constants/roles';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) { }

  public async getUsers() {
    return this.userRepository.find();
  }

  public async create(data: CreateUserDto) {
    const [role, user, hashedPassword] = await Promise.all([
      this.roleRepository.findOneBy({ role: ROLES.SUPER_ADMIN }),
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

  public async updateUser(userId: number, data: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (data.email && typeof data?.email !== 'undefined') {
      const isEmailTaken = await this.userRepository.findOne({
        where: { email: data.email },
      });
      if (!!isEmailTaken) {
        throw new ForbiddenException('Email has alread been taken');
      }
    }
    await this.userRepository.save(
      plainToInstance(UserEntity, {
        ...user,
        ...data,
      }),
    );
  }
}
