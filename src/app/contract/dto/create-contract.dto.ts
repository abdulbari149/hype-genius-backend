import { IsBoolean, IsNumber, IsOptional, Validate } from 'class-validator';
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
  @IsNumber()
  @IsOptional()
  contract_id: number;

  @IsBoolean()
  is_one_time: boolean;

  @IsNumber()
  upload_frequency: number;

  @IsNumber()
  amount: number;

  @IsNumber()
  @Validate(IsExist, ['currencies', 'id'], {
    message: CURRENCY_NOT_FOUND,
  })
  currency_id: number | null;

  @IsNumber()
  @Validate(IsExist, ['business_channel', 'id'], {
    message: BUSINESS_CHANNEL_NOT_FOUND,
  })
  business_channel_id: number | null;
}
