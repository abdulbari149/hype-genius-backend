import DefaultEntity from 'src/helpers/default.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { NotesEntity } from './notes.entity';
import VideosEntity from 'src/app/videos/entities/videos.entity';

@Entity('video_notes')
export class VideoNotesEntity extends DefaultEntity {
  @Column({ name: 'note_id', type: 'integer', nullable: false })
  note_id: number;

  @ManyToOne(() => NotesEntity, (n) => n.video_notes)
  @JoinColumn({ name: 'note_id', referencedColumnName: 'id' })
  notes: NotesEntity;

  @Column({ name: 'video_id', type: 'integer', nullable: false })
  video_id: number;

  @ManyToOne(() => VideosEntity, (v) => v.video_notes)
  @JoinColumn({ name: 'video_id', referencedColumnName: 'id' })
  videos: VideosEntity;
}
