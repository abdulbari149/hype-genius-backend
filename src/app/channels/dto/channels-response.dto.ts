import { Exclude, Expose, Type } from 'class-transformer';

@Exclude({ toClassOnly: true })
export class ChannelResponse {
  @Type(() => Number)
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  link: string;
  @Type(() => Number)
  @Expose()
  influencer_id: number;
  @Expose()
  createdAt: Date | null;
  @Expose()
  updatedAt: Date | null;
  @Expose()
  deletedAt: Date | null;
}
