import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateContractDto } from './create-contract.dto';
import { IsNumber, IsNotEmpty, Validate } from 'class-validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { MESSAGES } from 'src/common/messages';

const {
  BUSINESS_CHANNELS: {
    ERROR: { BUSINESS_CHANNEL_NOT_FOUND },
  },
} = MESSAGES;

export class UpdateContractDto extends PartialType(
  OmitType(CreateContractDto, ['business_channel_id']),
) {
  @IsNumber()
  @IsNotEmpty()
  @Validate(IsExist, ['business_channel', 'id'], {
    message: BUSINESS_CHANNEL_NOT_FOUND,
  })
  business_channel_id: number | null;
}
