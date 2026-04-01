import { Exclude, Expose, Transform } from 'class-transformer';
import { Column } from 'typeorm';

@Exclude()
export class RoutesResponse {
  @Expose()
  @Column({
    name: 'id',
  })
  id: number;

  @Expose()
  @Column({ name: 'request_type' })
  request_type: string;

  @Expose()
  @Column({ name: 'end_point' })
  end_point: string;

  @Expose()
  @Transform(({ value }) =>
    value ? value.map((r: any) => (r.roles ? r.roles.name : r)) : [],
  )
  user_roles: string[];
}
