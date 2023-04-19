import ContractEntity from '../../contract/entities/contract.entity';
import UserEntity from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import DefaultEntity from '../../../helpers/DefaultEntity';
import ChannelsEntity from '../../channels/entities/channels.entity';
import BusinessEntity from './business.entity';
import FollowUpEntity from './follow.up.entity';
import TagsEntity from '../../tags/entities/tags.entity';
import VideosEntity from '../../videos/entities/videos.entity';
import { BusinessChannelNotesEntity } from '../../notes/entities/business_channel_notes.entity';
import { BusinessChannelAlertsEntity } from '../../alerts/entities/business_channel_alerts.entity';
import PaymentsEntity from '../../payments/entities/payments.entity';

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

  @OneToOne(() => ContractEntity, (c) => c.business_channel)
  contract: ContractEntity;

  @OneToMany(() => TagsEntity, (t) => t.business_channels, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  tags: TagsEntity[];

  @OneToMany(() => VideosEntity, (v) => v.business_channels, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  videos: VideosEntity[];

  @OneToMany(() => BusinessChannelNotesEntity, (v) => v.business_channels, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  business_channel_notes: BusinessChannelNotesEntity[];
  @OneToMany(
    () => BusinessChannelAlertsEntity,
    (businessChannelAlerts) => businessChannelAlerts.businessChannel,
  )
  business_channel_alerts: BusinessChannelAlertsEntity[];

  @OneToMany(() => PaymentsEntity, (p) => p.business_channels, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  payments: PaymentsEntity;
}
