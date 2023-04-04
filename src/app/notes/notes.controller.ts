import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Response,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNotesDto } from './dto/create-notes.dto';
import { Request, Response as ExpressResponse } from 'express';
import ResponseEntity from 'src/helpers/ResponseEntity';
@Controller({
  path: 'notes',
  version: '1',
})
export class NotesController {
  constructor(private notesService: NotesService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/:business_channel_id')
  async CreateBusinessChannelNotes(
    @Body() data: CreateNotesDto,
    @Param('business_channel_id') business_channel_id: number,
  ) {
    const result = await this.notesService.CreateBusinessChannelNotes(
      data,
      business_channel_id,
    );
    return new ResponseEntity(result, 'Note Created successfully');
  }
}
