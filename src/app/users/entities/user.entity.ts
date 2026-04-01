import BusinessChannelsEntity from '../../business/entities/business.channel.entity';
import BusinessEntity from '../../business/entities/business.entity';
import ChannelsEntity from '../../channels/entities/channels.entity';
import { RoleEntity } from '../../roles/entities/role.entity';
import DefaultEntity from '../../../helpers/DefaultEntity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'users' })
export default class UserEntity extends DefaultEntity {
  @Column({ name: 'first_name', type: 'varchar', length: 255, nullable: false })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255, nullable: false })
  lastName: string;

  @Column({ name: 'email', type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  phoneNumber: string;

  @Column({ name: 'role_id', type: 'int8', nullable: false })
  roleId: number;

  @ManyToOne(() => RoleEntity, (r) => r.users)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: RoleEntity;

  @OneToOne(() => BusinessEntity, (b) => b.admin, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  business: BusinessEntity;

  @OneToMany(() => ChannelsEntity, (c) => c.user, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  channels: ChannelsEntity[];

  @OneToMany(() => BusinessChannelsEntity, (bc) => bc.user, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  business_channels: BusinessChannelsEntity[];
}
