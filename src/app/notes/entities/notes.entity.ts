import DefaultEntity from '../../../helpers/DefaultEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { BusinessChannelNotesEntity } from './business_channel_notes.entity';
import { VideoNotesEntity } from './video_notes.entity';

@Entity('notes')
export class NotesEntity extends DefaultEntity {
  @OneToMany(() => BusinessChannelNotesEntity, (bcn) => bcn.notes)
  business_channel_notes: BusinessChannelNotesEntity[];

  @OneToMany(() => VideoNotesEntity, (vn) => vn.notes)
  video_notes: VideoNotesEntity[];

  @Column({ name: 'body', type: 'text', nullable: false })
  body: string;
}
