import { AlertsEntity } from './alerts.entity';
import BusinessChannelEntity from '../../business/entities/business.channel.entity';
import DefaultEntity from 'src/helpers/default.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('business_channel_alerts')
export class BusinessChannelAlertsEntity extends DefaultEntity {
  @Column({ name: 'business_channel_id', type: 'int8', nullable: false })
  businessChannelId: number;

  @ManyToOne(() => BusinessChannelEntity, (bc) => bc.business_channel_alerts)
  @JoinColumn({ name: 'business_channel_id', referencedColumnName: 'id' })
  business_channels: BusinessChannelEntity;

  @Column({ name: 'alert_id', type: 'int8', nullable: false })
  alertId: number;

  @ManyToOne(() => AlertsEntity, (a) => a.business_channel_alerts)
  @JoinColumn({ name: 'alert_id', referencedColumnName: 'id' })
  alerts: AlertsEntity;
}
