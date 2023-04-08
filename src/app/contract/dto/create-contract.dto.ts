import { IsBoolean, IsNotEmpty, IsNumber, Validate } from 'class-validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { MESSAGES } from '../../../common/messages';
const {
  CURRENCY: {
    ERROR: { CURRENCY_NOT_FOUND },
  },
  BUSINESS_CHANNELS: {
    ERROR: { BUSINESS_CHANNEL_NOT_FOUND },
  },
} = MESSAGES;

export class CreateContractDto {
  @IsBoolean()
  @IsNotEmpty()
  is_one_time: boolean;

  @IsNumber()
  @IsNotEmpty()
  upload_frequency: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  @Validate(IsExist, ['currencies', 'id'], {
    message: CURRENCY_NOT_FOUND,
  })
  currency_id: number | null;

  @IsNumber()
  @IsNotEmpty()
  @Validate(IsExist, ['business_channel', 'id'], {
    message: BUSINESS_CHANNEL_NOT_FOUND,
  })
  business_channel_id: number | null;
}
