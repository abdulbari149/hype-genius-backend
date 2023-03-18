import ContractEntity from 'src/app/contract/entities/contract.entity';
import PaymentsEntity from 'src/app/payments/entities/payments.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import DefaultEntity from '../../../helpers/default.entity';

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

  @OneToMany(() => PaymentsEntity, (p) => p.currencies, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  payments: PaymentsEntity[];
}
