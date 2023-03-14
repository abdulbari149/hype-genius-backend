import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import DefaultEntity from 'src/helpers/default.entity';
import UserEntity from 'src/app/users/entities/user.entity';
import BusinessChannelsEntity from 'src/app/business/entities/business.channels.entity';

@Entity('channels')
export default class ChannelsEntity extends DefaultEntity {
  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ name: 'link', type: 'varchar', nullable: false })
  link: string;

  @Column({ name: 'influencer_id', type: 'int8', nullable: false })
  influencer_id: number;

  @ManyToOne(() => UserEntity, (u) => u.channels)
  @JoinColumn({ name: 'influencer_id', referencedColumnName: 'id' })
  user: UserEntity;

  @OneToMany(() => BusinessChannelsEntity, (bc) => bc.user, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  business_channels: BusinessChannelsEntity[];
}
