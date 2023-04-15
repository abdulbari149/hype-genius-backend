import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsOnlyDate } from 'src/utils/validators/is-only-date.validator';

export class GetVideosQueryDto {
  @IsOptional()
  @IsNumber()
  business_channel_id?: number;

  @IsOptional()
  @Transform(({ obj, key }) => {
    const value = obj[key];
    return typeof value === 'string' ? value === 'true' : value;
  })
  @IsBoolean()
  is_payment_due?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => {
    console.log({ value });
    return typeof value === 'string' ? value.split(',') : value;
  })
  fields?: string[];

  @IsOptional()
  @IsString()
  @Validate(IsOnlyDate, {
    message: 'start_date can only be of format YYYY-MM-DD',
  })
  start_date?: string;

  @IsOptional()
  @IsString()
  @Validate(IsOnlyDate, {
    message: 'end_datee can only be of format YYYY-MM-DD',
  })
  end_date?: string;
}
