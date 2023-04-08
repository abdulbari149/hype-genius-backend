import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import DefaultEntity from '../../../helpers/default.entity';
import { payment_status_enums } from 'src/common/enum';
import CurrencyEntity from 'src/app/currency/entities/currency.entity';
import VideosEntity from 'src/app/videos/entities/videos.entity';
import BusinessChannelEntity from 'src/app/business/entities/business.channel.entity';

@Entity('payments')
export default class PaymentsEntity extends DefaultEntity {
  @Column({
    name: 'business_amount',
    type: 'bigint',
    nullable: false,
  })
  business_amount: number;

  @Column({
    name: 'channel_amount',
    type: 'bigint',
    nullable: false,
  })
  channel_amount: number;

  @Column({ name: 'channel_currency_id', type: 'int8', nullable: false })
  channel_currency_id: number;

  @ManyToOne(() => CurrencyEntity, (c) => c.channel_payments)
  @JoinColumn({ name: 'channel_currency_id', referencedColumnName: 'id' })
  channel_currencies: CurrencyEntity;

  @Column({ name: 'business_currency_id', type: 'int8', nullable: false })
  business_currency_id: number;

  @ManyToOne(() => CurrencyEntity, (c) => c.business_payments)
  @JoinColumn({ name: 'business_currency_id', referencedColumnName: 'id' })
  business_currencies: CurrencyEntity;

  @Column({ name: 'business_channel_id', type: 'int8', nullable: false })
  business_channel_id: number;

  @ManyToOne(() => BusinessChannelEntity, (bc) => bc.payments)
  @JoinColumn({ name: 'business_channel_id', referencedColumnName: 'id' })
  business_channels: BusinessChannelEntity;

  @OneToMany(() => VideosEntity, (v) => v.payments, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  videos: VideosEntity[];
}
