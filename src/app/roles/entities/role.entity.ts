import DefaultEntity from 'src/helpers/default.entity';
import { Column, Entity } from 'typeorm';

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
}
