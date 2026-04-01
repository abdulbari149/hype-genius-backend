import DefaultEntity from '../../../helpers/DefaultEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { BusinessChannelAlertsEntity } from './business_channel_alerts.entity';

@Entity('alerts')
export class AlertsEntity extends DefaultEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'color',
    type: 'varchar',
    nullable: false,
  })
  color: string;

  @Column({
    name: 'priority',
    type: 'int4',
    nullable: false,
  })
  priority: number;

  @OneToMany(
    () => BusinessChannelAlertsEntity,
    (businessChannelAlerts) => businessChannelAlerts.alert,
  )
  business_channel_alerts: BusinessChannelAlertsEntity[];
}
