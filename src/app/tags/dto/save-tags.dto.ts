import { OmitType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  ValidateNested,
  IsNotEmpty,
  ArrayNotEmpty,
  Validate,
  IsNumber,
} from 'class-validator';
import { CreateTagsDto } from './create-tags.dto';
import { IsExist } from 'src/utils/validators/is-exists.validator';

class NewTagDto extends OmitType(CreateTagsDto, ['business_channel_id']) {}
class OldTagDto extends NewTagDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class SaveTagsDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NewTagDto)
  new_tags: Array<NewTagDto>;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OldTagDto)
  old_tags?: Array<OldTagDto>;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OldTagDto)
  delete_tags?: Array<OldTagDto>;

  @IsNotEmpty()
  @IsNumber()
  @Validate(IsExist, ['business_channel', 'id'])
  business_channel_id: number;
}
