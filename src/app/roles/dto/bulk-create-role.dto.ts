import { IsNotEmpty, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export default class BulkCreateRoleDto {
  @IsNotEmpty()
  @IsArray()
  @Type(() => String)
  roles: string[];
}
