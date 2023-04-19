import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RoutesEntity } from '../../routes/entities/route.entity';
import { RoleEntity } from '../../roles/entities/role.entity';
import DefaultEntity from '../../../helpers/DefaultEntity';

@Entity('route_permissions')
export class RoutePermissionsEntity extends DefaultEntity {
  @Column({ name: 'route_id' })
  route_id: number;

  @Column({ name: 'role_id' })
  role_id: number;

  @ManyToOne(() => RoutesEntity, (r) => r.route_permissions, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'route_id', referencedColumnName: 'id' })
  routes: RoutesEntity;

  @ManyToOne(() => RoleEntity, (r) => r.route_permissions, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  roles: RoleEntity;
}
