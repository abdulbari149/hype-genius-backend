import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class GetVideosQueryDto {
  @IsOptional()
  @IsNumber()
  business_channel_id?: number;

  @IsOptional()
  @IsBoolean()
  is_payment_due?: boolean;
}
