import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import DefaultEntity from '../../../helpers/default.entity';
import { payment_status_enums } from 'src/common/enum';
import CurrencyEntity from 'src/app/currency/entities/currency.entity';
import VideosEntity from 'src/app/videos/entities/videos.entity';

@Entity('payments')
export default class PaymentsEntity extends DefaultEntity {
  @Column({
    name: 'amount',
    type: 'bigint',
    nullable: false,
  })
  amount: number;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: [payment_status_enums.PAID, payment_status_enums.UNPAID],
    nullable: false,
  })
  payment_status: payment_status_enums;

  @Column({ name: 'currency_id', type: 'int8', nullable: false })
  currency_id: number;

  @ManyToOne(() => CurrencyEntity, (c) => c.payments)
  @JoinColumn({ name: 'currency_id', referencedColumnName: 'id' })
  currencies: CurrencyEntity;

  @OneToMany(() => VideosEntity, (v) => v.payments, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  videos: VideosEntity[];
}
