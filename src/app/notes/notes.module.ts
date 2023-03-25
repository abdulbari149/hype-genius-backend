import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { NotesRepository } from './notes.repository';
import { NotesEntity } from './entities/notes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotesEntity])],
  providers: [NotesService, NotesRepository],
  controllers: [NotesController],
  exports: [NotesService],
})
export class NotesModule {}
