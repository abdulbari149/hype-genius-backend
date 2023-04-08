import {
  IsInt,
  IsNotIn,
  IsNumber,
  IsPositive,
  Validate,
} from 'class-validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { MESSAGES } from 'src/common/messages';
const {
  CURRENCY: {
    ERROR: { CURRENCY_NOT_FOUND },
  },
} = MESSAGES;

export class CreatePaymentsDto {
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotIn([0])
  @Validate(IsExist, ['business_channels', 'id'], {
    message: 'Business Channel not found',
  })
  business_channel_id: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotIn([0])
  @Validate(IsExist, ['videos', 'id'], {
    message: 'Video not found',
  })
  video_id: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotIn([0])
  @Validate(IsExist, ['currencies', 'id'], {
    message: CURRENCY_NOT_FOUND,
  })
  business_currency_id: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotIn([0])
  @Validate(IsExist, ['currencies', 'id'], {
    message: CURRENCY_NOT_FOUND,
  })
  channel_currency_id: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  channel_amount: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  business_amount: number;
}
