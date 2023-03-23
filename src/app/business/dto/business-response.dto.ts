import { Exclude, Expose, Type } from 'class-transformer';

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
  @Type(() => Number)
  @Expose()
  adminId: number;
  @Expose()
  createdAt: Date | null;
  @Expose()
  updatedAt: Date | null;
  @Expose()
  deletedAt: Date | null;
}
