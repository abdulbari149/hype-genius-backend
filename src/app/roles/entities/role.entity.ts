import UserEntity from 'src/app/users/entities/user.entity';
import DefaultEntity from 'src/helpers/default.entity';
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
}
