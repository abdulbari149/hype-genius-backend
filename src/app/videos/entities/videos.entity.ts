import BusinessChannelEntity from '../../business/entities/business.channel.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import DefaultEntity from '../../../helpers/default.entity';
import PaymentsEntity from 'src/app/payments/entities/payments.entity';

@Entity('videos')
export default class VideosEntity extends DefaultEntity {
  @Column({
    name: 'title',
    type: 'varchar',
    nullable: false,
  })
  title: string;

  @Column({
    name: 'link',
    type: 'varchar',
    nullable: false,
  })
  link: string;

  @Column({
    name: 'views',
    type: 'bigint',
    nullable: false,
  })
  views: number;

  @Column({
    name: 'is_payment_due',
    type: 'boolean',
    nullable: false,
  })
  is_payment_due: boolean;

  @Column({ name: 'payment_id', type: 'int8', nullable: false })
  payment_id: number;

  @ManyToOne(() => PaymentsEntity, (p) => p.videos)
  @JoinColumn({ name: 'payment_id', referencedColumnName: 'id' })
  payments: PaymentsEntity;

  @Column({ name: 'business_channel_id', type: 'int8', nullable: false })
  business_channel_id: number;

  @ManyToOne(() => BusinessChannelEntity, (bc) => bc.videos)
  @JoinColumn({ name: 'business_channel_id', referencedColumnName: 'id' })
  business_channels: BusinessChannelEntity;
}
