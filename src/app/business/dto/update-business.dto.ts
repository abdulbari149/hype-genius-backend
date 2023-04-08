import {
  IsInt,
  IsNotIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Validate,
} from 'class-validator';
import { acrvv_enum } from 'src/common/enum';
import { MESSAGES } from 'src/common/messages';
import { IsExist } from 'src/utils/validators/is-exists.validator';
const {
  CURRENCY: {
    ERROR: { CURRENCY_NOT_FOUND },
  },
} = MESSAGES;

export class UpdateBusinessDto {
  @IsOptional()
  @IsString()
  public name: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  public link: string;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotIn([0])
  @Validate(IsExist, ['currencies', 'id'], {
    message: CURRENCY_NOT_FOUND,
  })
  default_currency_id: number;

  @IsOptional()
  @IsNumber()
  customer_ltv: number;

  @IsOptional()
  acrvv: acrvv_enum | number;
}
