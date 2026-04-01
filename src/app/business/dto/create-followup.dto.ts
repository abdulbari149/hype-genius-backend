import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Validate,
} from 'class-validator';
import { IsExist } from '../../../utils/validators/is-exists.validator';
import { IsOnlyDate } from '../../../utils/validators/is-only-date.validator';

export enum SendTo {
  EMAIL = 'email',
  PHONE = 'phone',
}

export default class CreateFollowUpDto {
  @IsNotEmpty()
  @IsNumber()
  @Validate(IsExist, ['business_channel', 'id'])
  business_channel_id: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(SendTo, {
    message: 'send_to can be one of email or phone',
  })
  send_to: SendTo;

  @IsNotEmpty()
  @IsString()
  info: string;

  @IsNotEmpty()
  @Validate(IsOnlyDate)
  schedule_at: string;
}
