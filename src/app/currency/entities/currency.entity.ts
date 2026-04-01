import ContractEntity from '../../contract/entities/contract.entity';
import PaymentsEntity from '../../payments/entities/payments.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import DefaultEntity from '../../../helpers/DefaultEntity';
import BusinessEntity from '../../business/entities/business.entity';

@Entity('currencies')
export default class CurrencyEntity extends DefaultEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @OneToMany(() => ContractEntity, (c) => c.currencies, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  contracts: ContractEntity[];

  @OneToMany(() => PaymentsEntity, (p) => p.business_currencies, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  business_payments: PaymentsEntity[];

  @OneToMany(() => PaymentsEntity, (p) => p.channel_currencies, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  channel_payments: PaymentsEntity[];

  @OneToMany(() => BusinessEntity, (b) => b.default_currencies, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  business: BusinessEntity[];
}
