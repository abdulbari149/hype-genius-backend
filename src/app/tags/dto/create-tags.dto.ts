import { IsBoolean, IsNumber, IsString, Validate } from 'class-validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { MESSAGES } from '../../../common/messages';
const {
  BUSINESS_CHANNELS: {
    ERROR: { BUSINESS_CHANNEL_NOT_FOUND },
  },
} = MESSAGES;

export class CreateTagsDto {
  @IsString()
  text: string;

  @IsString()
  color: string;

  @IsBoolean()
  active: boolean;

  @IsNumber()
  @Validate(IsExist, ['business_channel', 'id'], {
    message: BUSINESS_CHANNEL_NOT_FOUND,
  })
  business_channel_id: number | null;
}
