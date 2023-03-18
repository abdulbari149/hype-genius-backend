import { Column, Entity, OneToMany } from 'typeorm';
import { RoutePermissionsEntity } from '../../route_permission/entities/route-permission.entity';
import DefaultEntity from 'src/helpers/default.entity';

@Entity('routes')
export class RoutesEntity extends DefaultEntity {
  @Column()
  request_type: string;

  @Column()
  end_point: string;

  @OneToMany(() => RoutePermissionsEntity, (rp) => rp.routes, { cascade: true })
  route_permissions: RoutePermissionsEntity[];
}
