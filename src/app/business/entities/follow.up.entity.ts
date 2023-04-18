import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import DefaultEntity from 'src/helpers/default.entity';
import BusinessChannelEntity from './business.channel.entity';
import { BusinessChannelAlertsEntity } from 'src/app/alerts/entities/business_channel_alerts.entity';
import { SendTo } from '../dto/create-followup.dto';

@Entity('follow_ups')
export default class FollowUpEntity extends DefaultEntity {
  @Column({
    name: 'scheduled_at',
    type: 'date',
    nullable: false,
  })
  schedule_at: string;

  @Column({
    name: 'send_to',
    type: 'enum',
    nullable: false,
    enum: SendTo,
    enumName: 'send_to_enum',
  })
  send_to: string;

  @Column({ name: 'business_channel_alert_id', type: 'int8', nullable: true })
  business_channel_alert_id?: number;

  @Column({ name: 'business_channel_id', type: 'int8', nullable: false })
  business_channel_id: number;

  @ManyToOne(() => BusinessChannelEntity, (bc) => bc.follow_ups)
  @JoinColumn({ name: 'business_channel_id', referencedColumnName: 'id' })
  business_channels: BusinessChannelEntity;

  @ManyToOne(() => BusinessChannelAlertsEntity, (bca) => bca.follow_ups)
  @JoinColumn({ name: 'business_channel_alert_id', referencedColumnName: 'id' })
  business_channel_alert: BusinessChannelAlertsEntity;
}
