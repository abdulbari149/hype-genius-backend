import {
  IsInt,
  IsNotIn,
  IsNumber,
  IsOptional,
  IsPositive,
  Validate,
} from 'class-validator';
import { MESSAGES } from 'src/common/messages';
import { IsExist } from 'src/utils/validators/is-exists.validator';
const {
  CURRENCY: {
    ERROR: { CURRENCY_NOT_FOUND },
  },
} = MESSAGES;

export class UpdateBusinessDto {
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
  @IsNumber()
  acrvv: number;
}
