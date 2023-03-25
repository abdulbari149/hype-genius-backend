import { Injectable } from '@nestjs/common';
import { NotesRepository } from './notes.repository';

@Injectable()
export class NotesService {
  constructor(private notesRepository: NotesRepository) {}
}
