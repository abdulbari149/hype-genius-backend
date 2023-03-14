import UserEntity from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import DefaultEntity from 'src/helpers/default.entity';
import BusinessChannelsEntity from './business.channels.entity';

@Entity('business')
export default class BusinessEntity extends DefaultEntity {
  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ name: 'link', type: 'varchar', nullable: false })
  link: string;

  @Column({ name: 'admin_id', type: 'int8', nullable: false })
  admin_id: number;

  @OneToOne(() => UserEntity, (u) => u.business)
  @JoinColumn({ name: 'admin_id', referencedColumnName: 'id' })
  user: UserEntity;

  @OneToMany(() => BusinessChannelsEntity, (bc) => bc.business, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  business_channels: BusinessChannelsEntity[];
}
