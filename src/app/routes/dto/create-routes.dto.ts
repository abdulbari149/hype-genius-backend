import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { IsMultipleExist } from '../../../utils/validators/is-multiple-exist.validator';
import { IsNotExist } from '../../../utils/validators/is-not-exists.validator';

export class CreateRoutesDto {
  @Transform(({ value }) => value.toUpperCase().trim())
  @Length(1, 255)
  @IsNotEmpty()
  @IsString()
  request_type: string;

  @Length(1, 255)
  @IsNotEmpty()
  @IsString()
  end_point: string;

  @Validate(IsMultipleExist, ['roles', 'id'], {
    message: "role doesn't exists",
  })
  @IsNotEmpty()
  @IsArray()
  roles: number[];
}
