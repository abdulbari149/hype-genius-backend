import { Injectable } from '@nestjs/common';
import { NotesRepository } from './notes.repository';
import { CreateNotesDto } from './dto/create-notes.dto';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { NotesEntity } from './entities/notes.entity';
import { BusinessChannelNotesEntity } from './entities/business_channel_notes.entity';

@Injectable()
export class NotesService {
  constructor(
    private notesRepository: NotesRepository,
    private dataSource: DataSource,
  ) {}

  public async CreateBusinessChannelNotes(
    data: CreateNotesDto,
    business_channel_id: number,
  ) {
    const query_runner = this.dataSource.createQueryRunner();
    try {
      await query_runner.startTransaction();
      const mapped_notes = plainToInstance(NotesEntity, data);
      const notes = await query_runner.manager.save(mapped_notes);
      const mapped_business_channel_notes = plainToInstance(
        BusinessChannelNotesEntity,
        {
          note_id: notes.id,
          business_channel_id,
        },
      );
      const business_channel_notes = await query_runner.manager.save(
        mapped_business_channel_notes,
      );
      await query_runner.commitTransaction();
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw error;
    } finally {
      await query_runner.release();
    }
  }
}
