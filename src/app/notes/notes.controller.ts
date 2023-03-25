import { Controller } from '@nestjs/common';
import { NotesService } from './notes.service';
@Controller({
  path: 'notes',
  version: '1',
})
export class NotesController {
  constructor(private notesService: NotesService) {}
}
