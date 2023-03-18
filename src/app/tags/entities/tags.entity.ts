import BusinessChannelEntity from '../../business/entities/business.channel.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import DefaultEntity from '../../../helpers/default.entity';

@Entity('tags')
export default class TagsEntity extends DefaultEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'colour',
    type: 'varchar',
    nullable: false,
  })
  colour: string;

  @Column({
    name: 'is_activated',
    type: 'boolean',
  })
  is_activated: boolean;

  @Column({ name: 'business_channel_id', type: 'int8', nullable: false })
  business_channel_id: number;

  @ManyToOne(() => BusinessChannelEntity, (bc) => bc.tags)
  @JoinColumn({ name: 'business_channel_id', referencedColumnName: 'id' })
  business_channels: BusinessChannelEntity;
}