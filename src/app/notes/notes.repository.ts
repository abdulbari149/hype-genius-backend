import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { NotesEntity } from './entities/notes.entity';

@Injectable()
export class NotesRepository extends Repository<NotesEntity> {
  constructor(private dataSource: DataSource) {
    super(NotesEntity, dataSource.createEntityManager());
  }
}
