import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Validate,
} from 'class-validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';

export class CreateVideoDto {
  @IsNotEmpty()
  @IsUrl()
  @IsString()
  link: string;

  @Validate(IsExist, ['business', 'id'])
  @IsNotEmpty()
  @IsNumber()
  businessId: number;
}
