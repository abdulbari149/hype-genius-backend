import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class VideosResponseDto {
  @Expose()
  @Type(() => Number)
  id: number;
  @Expose()
  link: string;
  @Expose()
  title: string;
  @Expose()
  views: number;
  @Expose()
  is_payment_due: boolean;
  @Expose()
  payment_id: number;
  @Expose()
  business_channel_id: number;
  @Expose()
  createdAt: Date | null;
  @Expose()
  updatedAt: Date | null;
  @Expose()
  deletedAt: Date | null;
}
