import { Exclude, Expose, Type } from 'class-transformer';

@Exclude({ toClassOnly: true })
export default class UserResponse {
  @Type(() => Number)
  @Expose()
  id: number;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  email: string;
  @Expose()
  phoneNumber: string;
  @Type(() => Number)
  @Expose()
  roleId: number;
  @Expose()
  role: string;
  @Expose()
  createdAt: Date | null;
  @Expose()
  updatedAt: Date | null;
  @Expose()
  deletedAt: Date | null;
}
