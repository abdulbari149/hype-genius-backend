import { NotesEntity } from 'src/app/notes/entities/notes.entity';
import BusinessChannelEntity from 'src/app/business/entities/business.channel.entity';
import DefaultEntity from 'src/helpers/default.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('business_channel_notes')
export class BusinessChannelNotesEntity extends DefaultEntity {
  @Column({ name: 'business_channel_id', type: 'integer', nullable: false })
  business_channel_id: number;

  @ManyToOne(() => BusinessChannelEntity, (bc) => bc.business_channel_notes)
  @JoinColumn({ name: 'business_channel_id', referencedColumnName: 'id' })
  business_channels: BusinessChannelEntity;

  @Column({ name: 'note_id', type: 'integer', nullable: false })
  note_id: number;

  @ManyToOne(() => NotesEntity, (n) => n.business_channel_notes)
  @JoinColumn({ name: 'note_id', referencedColumnName: 'id' })
  notes: NotesEntity;
}