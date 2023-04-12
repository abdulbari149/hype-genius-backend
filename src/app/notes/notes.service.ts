import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { NotesRepository } from './notes.repository';
import { CreateBusinessChannelNotesDto } from './dto/create-notes.dto';
import { DataSource, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { NotesEntity } from './entities/notes.entity';
import { BusinessChannelNotesEntity } from './entities/business_channel_notes.entity';
import { NotesResponse } from './dto/notes-response.dto';
import BusinessChannelEntity from '../business/entities/business.channel.entity';

@Injectable()
export class NotesService {
  constructor(
    private notesRepository: NotesRepository,
    @InjectRepository(BusinessChannelEntity)
    private businessChannelRepository: Repository<BusinessChannelEntity>,
    @InjectRepository(BusinessChannelNotesEntity)
    private businessChannelNotesRepository: Repository<BusinessChannelNotesEntity>,
    private dataSource: DataSource,
  ) {}

  public async createBusinessChannelNotes(
    data: CreateBusinessChannelNotesDto,
    business_channel_id: number,
  ) {
    const query_runner = this.dataSource.createQueryRunner();
    try {
      await query_runner.startTransaction();
      const mapped_notes = plainToInstance(NotesEntity, { body: data.body });
      const notes = await query_runner.manager.save(mapped_notes);
      const mapped_business_channel_notes = plainToInstance(
        BusinessChannelNotesEntity,
        {
          note_id: notes.id,
          business_channel_id,
          pinned: data.pinned,
        },
      );
      const business_channel_notes = await query_runner.manager.save(
        mapped_business_channel_notes,
      );
      await query_runner.commitTransaction();
      const response = plainToInstance(NotesResponse, notes);
      return {
        ...response,
        business_channel_id,
        pinned: business_channel_notes.pinned,
      };
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw error;
    } finally {
      await query_runner.release();
    }
  }

  async getBusinessChannelNotes({ business_channel_id, business_id }) {
    const businessChannel = await this.businessChannelRepository.findOne({
      where: { id: business_channel_id, businessId: business_id },
    });
    if (!businessChannel)
      throw new NotFoundException(
        `The Channel doesn't belongs to your business`,
      );
    const businessChannelNotes = await this.businessChannelNotesRepository.find(
      {
        where: { business_channel_id },
        loadEagerRelations: false,
        relations: { notes: true },
      },
    );
    const data = businessChannelNotes.map((businessChannelNote) => ({
      ...businessChannelNote.notes,
      pinned: businessChannelNote.pinned,
    }));
    return data;
  }
}
