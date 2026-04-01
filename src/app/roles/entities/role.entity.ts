import { RoutePermissionsEntity } from '../../route_permission/entities/route-permission.entity';
import UserEntity from '../../users/entities/user.entity';
import DefaultEntity from '../../../helpers/DefaultEntity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'roles' })
export class RoleEntity extends DefaultEntity {
  @Column({
    name: 'role',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  role: string;

  @OneToMany(() => UserEntity, (u) => u.role, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  users: UserEntity[];

  @OneToMany(() => RoutePermissionsEntity, (rp) => rp.roles, { cascade: true })
  route_permissions: RoutePermissionsEntity[];
}
