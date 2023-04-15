import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Validate,
} from 'class-validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { MESSAGES } from '../../../common/messages';
import { UploadFrequencies } from 'src/constants/upload_frequencies';
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

  @IsString()
  @IsEnum(UploadFrequencies)
  @IsNotEmpty()
  upload_frequency: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  budget: number;

  @IsNumber()
  @IsNotEmpty()
  @Validate(IsExist, ['currencies', 'id'], {
    message: CURRENCY_NOT_FOUND,
  })
  currency_id: number;

  @IsNumber()
  @IsNotEmpty()
  @Validate(IsExist, ['business_channel', 'id'], {
    message: BUSINESS_CHANNEL_NOT_FOUND,
  })
  business_channel_id: number;
}
