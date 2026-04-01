import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import ResponseEntity from 'src/helpers/ResponseEntity';
import BulkCreateRoleDto from './dto/bulk-create-role.dto';

@Controller({
  path: 'roles',
  version: '1',
})
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('/bulk')
  async bulk(@Body() body: BulkCreateRoleDto) {
    const data = await Promise.all(
      body.roles.map((role) => this.rolesService.create({ role })),
    );
    return new ResponseEntity(
      data,
      'Roles created successfully',
      HttpStatus.CREATED,
    );
  }

  @Post()
  async create(@Body() body: CreateRoleDto) {
    const result = await this.rolesService.create(body);
    return new ResponseEntity(
      result,
      'Role Created Successfully',
      HttpStatus.CREATED,
    );
  }

  @Get()
  async findAll() {
    const data = await this.rolesService.findAll();
    return new ResponseEntity(data, 'List of roles');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.rolesService.findOne(+id);
    return new ResponseEntity(data, `Role with id ${id}`);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateRoleDto) {
    const data = await this.rolesService.update(+id, body);
    return new ResponseEntity(
      data,
      `Role with id ${id} was updated successfully`,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.rolesService.remove(+id);
    return new ResponseEntity(
      data,
      `Role with id ${id} was deleted successfully`,
    );
  }
}
