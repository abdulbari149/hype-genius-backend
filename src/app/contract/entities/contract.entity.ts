import BusinessChannelEntity from '../../business/entities/business.channel.entity';
import CurrencyEntity from '../../currency/entities/currency.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import DefaultEntity from '../../../helpers/default.entity';
import { UploadFrequencies } from 'src/constants/upload_frequencies';

@Entity('contracts')
export default class ContractEntity extends DefaultEntity {
  @Column({
    name: 'is_one_time',
    type: 'boolean',
    nullable: false,
  })
  is_one_time: boolean;

  @Column({
    name: 'upload_frequency',
    type: 'varchar',
    enum: Object.values(UploadFrequencies),
    enumName: 'upload_frequency_enum',
    nullable: false,
  })
  upload_frequency: number;

  @Column({ name: 'amount', type: 'float', nullable: false })
  amount: number;

  @Column({ name: 'currency_id', type: 'int8', nullable: false })
  currency_id: number;

  @ManyToOne(() => CurrencyEntity, (c) => c.contracts)
  @JoinColumn({ name: 'currency_id', referencedColumnName: 'id' })
  currencies: CurrencyEntity;

  @Column({ name: 'business_channel_id', type: 'int8', nullable: false })
  business_channel_id: number;

  @OneToOne(() => BusinessChannelEntity, (bc) => bc.contract)
  @JoinColumn({ name: 'business_channel_id', referencedColumnName: 'id' })
  business_channel: BusinessChannelEntity;
}
