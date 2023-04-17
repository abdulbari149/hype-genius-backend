import TagsEntity from 'src/app/tags/entities/tags.entity';
import ContractEntity from 'src/app/contract/entities/contract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import DefaultEntity from 'src/helpers/default.entity';
import BusinessEntity from 'src/app/business/entities/business.entity';

type Empty<T> = {
  [P in keyof T]?: T[P] | null | undefined;
};

export interface OnboardRequestsData {
  contract?: Empty<
    Pick<
      ContractEntity,
      'amount' | 'is_one_time' | 'currency_id' | 'upload_frequency' | 'budget'
    > & { note?: string }
  >;
  tags?: Array<Empty<Pick<TagsEntity, 'text' | 'color' | 'active'>>>;
}

@Entity('onboard_requests')
export default class OnboardRequestsEntity extends DefaultEntity {
  @Column({ name: 'link', type: 'varchar', nullable: false })
  link: string;

  @Column({ name: 'business_id', type: 'int8', nullable: false })
  business_id: number;

  @Column({ name: 'data', type: 'jsonb', nullable: false })
  data: OnboardRequestsData;

  @ManyToOne(() => BusinessEntity, (business) => business.onboardRequests)
  @JoinColumn({ name: 'business_id', referencedColumnName: 'id' })
  business: BusinessEntity;
}
