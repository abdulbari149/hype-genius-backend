import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  Validate,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsString,
  IsInt,
  IsPositive,
  IsNotIn,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateTagsDto } from 'src/app/tags/dto/create-tags.dto';
import { MESSAGES } from 'src/common/messages';
import { UploadFrequencies } from 'src/constants/upload_frequencies';
import { IsExist } from 'src/utils/validators/is-exists.validator';

const {
  CURRENCY: {
    ERROR: { CURRENCY_NOT_FOUND },
  },
} = MESSAGES;

class OnboardingTagDto extends OmitType(CreateTagsDto, [
  'business_channel_id',
]) {}
export class UpdateOnboardingDto {
  @Validate(IsExist, ['onboard_requests', 'id'])
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotIn([0])
  onboarding_id: number;

  @IsOptional()
  @IsBoolean()
  is_one_time?: boolean;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotIn([0])
  @Validate(IsExist, ['currencies', 'id'], {
    message: CURRENCY_NOT_FOUND,
  })
  currency_id?: number;

  @IsOptional()
  @IsString()
  @IsEnum(UploadFrequencies)
  upload_frequency?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OnboardingTagDto)
  tags?: Array<OnboardingTagDto>;
}
