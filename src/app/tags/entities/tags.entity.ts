import BusinessChannelEntity from '../../business/entities/business.channel.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import DefaultEntity from '../../../helpers/DefaultEntity';

@Entity('tags')
export default class TagsEntity extends DefaultEntity {
  @Column({
    name: 'text',
    type: 'varchar',
    nullable: false,
  })
  text: string;

  @Column({
    name: 'color',
    type: 'varchar',
    nullable: false,
  })
  color: string;

  @Column({
    name: 'active',
    type: 'boolean',
  })
  active: boolean;

  @Column({ name: 'business_channel_id', type: 'int8', nullable: false })
  business_channel_id: number;

  @ManyToOne(() => BusinessChannelEntity, (bc) => bc.tags)
  @JoinColumn({ name: 'business_channel_id', referencedColumnName: 'id' })
  business_channels: BusinessChannelEntity;
}
