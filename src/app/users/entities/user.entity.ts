import DefaultEntity from 'src/helpers/default.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'users' })
export default class UserEntity extends DefaultEntity {
  @Column({ name: 'first_name', type: 'varchar', length: 255 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255 })
  lastName: string;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 255 })
  phoneNumber: string;
}
