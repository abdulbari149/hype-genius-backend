import { Exclude, Expose, Type } from 'class-transformer';

@Exclude({ toClassOnly: true })
export class TagsResponse {
  @Type(() => Number)
  @Expose()
  id: number;
  @Expose()
  text: string;
  @Expose()
  color: string;
  @Expose()
  active: string;
  @Expose()
  createdAt: Date | null;
  @Expose()
  updatedAt: Date | null;
  @Expose()
  deletedAt: Date | null;
}
