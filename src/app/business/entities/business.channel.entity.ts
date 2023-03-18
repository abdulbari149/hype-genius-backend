import UserEntity from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import DefaultEntity from 'src/helpers/default.entity';
import ChannelsEntity from 'src/app/channels/entities/channels.entity';
import BusinessEntity from './business.entity';
import FollowUpEntity from './follow.up.entity';

@Entity('business_channel')
export default class BusinessChannelEntity extends DefaultEntity {
  @Column({ name: 'business_id', type: 'int8', nullable: false })
  businessId: number;

  @ManyToOne(() => BusinessEntity, (b) => b.business_channels)
  @JoinColumn({ name: 'business_id', referencedColumnName: 'id' })
  business: BusinessEntity;

  @Column({ name: 'channel_id', type: 'int8', nullable: false })
  channelId: number;

  @ManyToOne(() => ChannelsEntity, (c) => c.business_channels)
  @JoinColumn({ name: 'channel_id', referencedColumnName: 'id' })
  channel: ChannelsEntity;

  @Column({ name: 'user_id', type: 'int8', nullable: false })
  userId: number;

  @ManyToOne(() => UserEntity, (u) => u.business_channels)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @OneToMany(() => FollowUpEntity, (fu) => fu.business_channels, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  follow_ups: FollowUpEntity[];
}
