import UserEntity from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import DefaultEntity from '../../../helpers/default.entity';
import BusinessChannelEntity from './business.channel.entity';
import OnboardRequestsEntity from 'src/app/channels/entities/onboard_requests.entity';
import CurrencyEntity from 'src/app/currency/entities/currency.entity';

@Entity('business')
export default class BusinessEntity extends DefaultEntity {
  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ name: 'link', type: 'varchar', nullable: false })
  link: string;

  @Column({ name: 'admin_id', type: 'int8', nullable: false })
  admin_id: number;

  @Column({ name: 'onboarding_link', type: 'varchar', nullable: false })
  onboardingLink: string;

  @OneToMany(
    () => OnboardRequestsEntity,
    (onboardRequests) => onboardRequests.business,
  )
  onboardRequests: OnboardRequestsEntity[];

  @OneToOne(() => UserEntity, (user) => user.business)
  @JoinColumn({ name: 'admin_id', referencedColumnName: 'id' })
  admin: UserEntity;

  @Column({ name: 'default_currency_id', type: 'int8', nullable: true })
  default_currency_id: number;

  @ManyToOne(() => CurrencyEntity, (c) => c.business)
  @JoinColumn({ name: 'default_currency_id', referencedColumnName: 'id' })
  default_currencies: CurrencyEntity;

  @Column({
    name: 'customer_ltv',
    type: 'bigint',
    nullable: true,
  })
  customer_ltv: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  acrvv: number;

  @OneToMany(() => BusinessChannelEntity, (bc) => bc.business, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  business_channels: BusinessChannelEntity[];
}
