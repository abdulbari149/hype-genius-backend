import { Exclude, Expose, Type } from 'class-transformer';
import { CurrencyResponse } from 'src/app/currency/dto/currency-response.dto';

@Exclude({ toClassOnly: true })
export class BusinessResponse {
  @Type(() => Number)
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  link: string;
  @Expose()
  onboardingLink: string;
  @Expose()
  default_currency_id?: number;
  @Expose()
  customer_ltv?: number;
  @Expose()
  acrvv?: number;
  @Type(() => Number)
  @Expose()
  admin_id: number;
  @Type(() => CurrencyResponse)
  @Expose()
  default_currency: CurrencyResponse;
  @Expose()
  createdAt: Date | null;
  @Expose()
  updatedAt: Date | null;
  @Expose()
  deletedAt: Date | null;
}
