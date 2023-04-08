import { CustomRequest } from './../../types/index';
import ResponseEntity from 'src/helpers/ResponseEntity';
import {
  Controller,
  HttpCode,
  Post,
  HttpStatus,
  Body,
  Req,
  Get,
  Query,
  BadRequestException,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import VideosService from './videos.service';
import { Payload } from 'src/decorators/payload.decorator';
import { DataSource } from 'typeorm';
import ROLES from 'src/constants/roles';
import AddNoteDto from './dto/add-note.dto';
import { JwtAccessPayload } from '../auth/auth.interface';

@Controller({
  path: '/videos',
  version: '1',
})
export default class VideosController {
  constructor(private videosService: VideosService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  async createVideo(@Body() data: CreateVideoDto, @Req() req: CustomRequest) {
    const result = this.videosService.createVideo(data, req.payload.channel_id);
    return new ResponseEntity(
      result,
      'Video created successfully',
      HttpStatus.CREATED,
    );
  }

  // TODO: query param is_payment_due (DONE)
  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getVideos(
    @Query('business_channel_id')
    business_channel_id?: number,
    @Query('is_payment_due')
    is_payment_due?: boolean,
    @Payload() payload?: JwtAccessPayload,
  ) {
    const parsedId = parseInt(business_channel_id.toString());
    if (
      payload.role === ROLES.BUSINESS_ADMIN &&
      (!business_channel_id || isNaN(parsedId))
    ) {
      throw new BadRequestException('business_channel_id is required');
    }

    const id = !isNaN(parsedId) ? parsedId : null;

    const result = await this.videosService.getVideos(
      id,
      is_payment_due,
      payload,
    );
    return new ResponseEntity(result, `Video Uploads List`);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/:id/note')
  async addNote(
    @Body() data: AddNoteDto,
    @Req() req: CustomRequest,
    @Param('id', ParseIntPipe) id: number,
    @Payload() payload: JwtAccessPayload,
  ) {
    const result = this.videosService.addNote(data, id, payload);
    return new ResponseEntity(
      result,
      'Note added successfully',
      HttpStatus.CREATED,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id/note')
  async getNotes(
    @Req() req: CustomRequest,
    @Param('id', ParseIntPipe) videoId: number,
    @Payload() payload: JwtAccessPayload,
  ) {
    const result = await this.videosService.getNotes(videoId, payload);
    return new ResponseEntity(
      result,
      `Notes for video ${videoId}`,
      HttpStatus.OK,
    );
  }
}
