import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import BusinessChannelEntity from 'src/app/business/entities/business.channel.entity';
import { AlertsEntity } from './alerts.entity';
import DefaultEntity from 'src/helpers/default.entity';

@Entity('business_channel_alert')
export class BusinessChannelAlertsEntity extends DefaultEntity {
  @Column()
  alert_id: number;

  @Column()
  business_channel_id: number;

  @ManyToOne(() => AlertsEntity, (alert) => alert.business_channel_alerts)
  @JoinColumn({ name: 'alert_id' })
  alert: AlertsEntity;

  @ManyToOne(
    () => BusinessChannelEntity,
    (businessChannel) => businessChannel.business_channel_alerts,
  )
  @JoinColumn({ name: 'business_channel_id' })
  businessChannel: BusinessChannelEntity;
}
