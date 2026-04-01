import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities/role.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}
  async create(data: CreateRoleDto): Promise<RoleEntity> {
    const role = await this.roleRepository.findOne({
      where: { role: data.role },
      withDeleted: true,
    });
    if (role && role.deletedAt === null) return role;
    if (role && role.deletedAt) return await role.recover();
    const role_entity = plainToInstance(RoleEntity, data);
    return await this.roleRepository.save(role_entity);
  }

  async findAll(): Promise<RoleEntity[]> {
    return await this.roleRepository.find();
  }

  async findOne(id: number): Promise<RoleEntity> {
    if (isNaN(id)) {
      throw new BadRequestException('invalid id');
    }
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`role with id ${id} not found`);
    }
    return role;
  }

  async update(id: number, data: UpdateRoleDto): Promise<RoleEntity> {
    const role = await this.findOne(id);
    Object.assign(role, data);
    await role.save();
    return role;
  }

  async remove(id: number): Promise<RoleEntity> {
    const role = await this.findOne(id);
    await role.softRemove();
    return role;
  }
}
