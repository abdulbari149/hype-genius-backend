import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';

export class GetBusinessReportQueryDto {
  @Validate(IsExist, ['business_channel', 'id'])
  @IsOptional()
  @IsNumber()
  business_channel_id?: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ obj, key }) => {
    const value = obj[key];
    return typeof value === 'string' ? value === 'true' : value;
  })
  report_for_all?: boolean;

  @IsDateString()
  @IsOptional()
  start_date?: Date;

  @IsDateString()
  @IsOptional()
  end_date?: Date;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  size?: number;

  @IsOptional()
  @IsString()
  sort?: string;
}
