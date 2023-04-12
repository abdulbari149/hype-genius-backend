import { Exclude, Expose, Type } from 'class-transformer';

@Exclude({ toClassOnly: true })
export class PaymentsResponseDto {
  @Expose()
  @Type(() => Number)
  id: number;
  @Type(() => Number)
  @Expose()
  business_amount: number;
  @Type(() => Number)
  @Expose()
  channel_amount: number;
  @Expose()
  channel_currency_id: boolean;
  @Expose()
  business_currency_id: number;
  @Expose()
  business_channel_id: number;
  @Expose()
  createdAt: Date | null;
  @Expose()
  updatedAt: Date | null;
  @Expose()
  deletedAt: Date | null;
}
