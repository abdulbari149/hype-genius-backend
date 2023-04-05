import { Payload } from 'src/decorators/payload.decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateBusinessChannelNotesDto } from './dto/create-notes.dto';
import ResponseEntity from 'src/helpers/ResponseEntity';
import { JwtAccessPayload } from '../auth/auth.interface';
@Controller({
  path: 'notes',
  version: '1',
})
export class NotesController {
  constructor(private notesService: NotesService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/:business_channel_id')
  async createBusinessChannelNotes(
    @Body() data: CreateBusinessChannelNotesDto,
    @Param('business_channel_id') business_channel_id: number,
  ) {
    const result = await this.notesService.createBusinessChannelNotes(
      data,
      business_channel_id,
    );
    return new ResponseEntity(result, 'Note Created successfully');
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:business_channel_id')
  async getBusinessChannelNotes(
    @Payload() payload: JwtAccessPayload,
    @Param('business_channel_id', ParseIntPipe) business_channel_id: number,
  ) {
    const result = await this.notesService.getBusinessChannelNotes({
      business_channel_id,
      business_id: payload.business_id,
    });
    return new ResponseEntity(
      result,
      `Notes List for Business Channel with id ${business_channel_id}`,
    );
  }
}
