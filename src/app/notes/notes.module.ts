import BusinessChannelEntity from 'src/app/business/entities/business.channel.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { NotesRepository } from './notes.repository';
import { NotesEntity } from './entities/notes.entity';
import { BusinessChannelNotesEntity } from './entities/business_channel_notes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotesEntity,
      BusinessChannelEntity,
      BusinessChannelNotesEntity,
    ]),
  ],
  providers: [NotesService, NotesRepository],
  controllers: [NotesController],
  exports: [NotesService],
})
export class NotesModule {}
