import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class BusinessResponse {
  @Type(() => Number)
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  link: string;
  @Expose()
  onboarding_link: string;
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
