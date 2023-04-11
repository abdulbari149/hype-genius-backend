import { Exclude, Expose, Type } from 'class-transformer';

@Exclude({ toClassOnly: true })
export class CurrencyResponse {
  @Type(() => Number)
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  createdAt: Date | null;
  @Expose()
  updatedAt: Date | null;
  @Expose()
  deletedAt: Date | null;
}
