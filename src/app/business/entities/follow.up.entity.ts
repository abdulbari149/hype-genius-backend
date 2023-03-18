import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import DefaultEntity from 'src/helpers/default.entity';
import BusinessChannelEntity from './business.channel.entity';

@Entity('follow_ups')
export default class FollowUpEntity extends DefaultEntity {
  @Column({
    name: 'scheduled_at',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  scheduled_at: string;

  @Column({ name: 'business_channel_id', type: 'int8', nullable: false })
  business_channel_id: number;

  @ManyToOne(() => BusinessChannelEntity, (bc) => bc.follow_ups)
  @JoinColumn({ name: 'business_channel_id', referencedColumnName: 'id' })
  business_channels: BusinessChannelEntity;
}
