import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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
}
