import {
  IsInt,
  IsNotEmpty,
  IsNotIn,
  IsNumber,
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
export class CreateBusinessDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  public link: string;

  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotIn([0])
  @Validate(IsExist, ['currencies', 'id'], {
    message: CURRENCY_NOT_FOUND,
  })
  default_currency_id: number;

  @IsNumber()
  customer_ltv: number;

  acrvv: acrvv_enum | number;
}
