import UserEntity from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import DefaultEntity from '../../../helpers/default.entity';
import BusinessChannelEntity from './business.channel.entity';
import OnboardRequestsEntity from 'src/app/channels/entities/onboard_requests.entity';

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

  @OneToMany(() => BusinessChannelEntity, (bc) => bc.business, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  business_channels: BusinessChannelEntity[];
}
