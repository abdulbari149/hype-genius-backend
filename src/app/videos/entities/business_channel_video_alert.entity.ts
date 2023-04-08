import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import DefaultEntity from '../../../helpers/default.entity';
import { BusinessChannelAlertsEntity } from '../../alerts/entities/business_channel_alerts.entity';
import VideosEntity from './videos.entity';

@Entity('business_channel_alert_video')
export default class BusinessChannelAlertVideoEntity extends DefaultEntity {
  @Column({
    name: 'business_channel_alert_id',
    type: 'integer',
    nullable: false,
  })
  business_channel_alert_id: number;

  @ManyToOne(
    () => BusinessChannelAlertsEntity,
    (bca) => bca.business_channel_alert_video,
  )
  @JoinColumn({ name: 'business_channel_id', referencedColumnName: 'id' })
  business_channel_alert: BusinessChannelAlertsEntity;

  @Column({
    name: 'video_id',
    type: 'integer',
    nullable: false,
  })
  video_id: number;

  @ManyToOne(() => VideosEntity, (v) => v.business_channel_alert_video)
  @JoinColumn({ name: 'video_id', referencedColumnName: 'id' })
  videos: VideosEntity;
}
