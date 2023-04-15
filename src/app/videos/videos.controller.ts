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
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import VideosService from './videos.service';
import { Payload } from 'src/decorators/payload.decorator';
import { FindOptionsWhere } from 'typeorm';
import AddNoteDto from './dto/add-note.dto';
import { JwtAccessPayload } from '../auth/auth.interface';
import VideosEntity from './entities/videos.entity';
import { GetVideosQueryDto } from './dto/get-videos-query.dto';

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

  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getVideos(
    @Query() query: GetVideosQueryDto,
    @Payload() payload?: JwtAccessPayload,
  ) {
    const where: Partial<FindOptionsWhere<VideosEntity>> = {};
    const dateFilters: Pick<GetVideosQueryDto, 'start_date' | 'end_date'> = {};
    if (typeof query?.business_channel_id !== 'undefined') {
      where.business_channel_id = query.business_channel_id;
    }
    if (typeof query?.is_payment_due !== 'undefined') {
      console.log(query.is_payment_due);
      where.is_payment_due = query.is_payment_due;
    }

    if (typeof query?.start_date !== 'undefined') {
      console.log(query?.start_date);
      dateFilters.start_date = query?.start_date;
    }

    if (typeof query?.end_date !== 'undefined') {
      console.log(query?.end_date);
      dateFilters.end_date = query?.end_date;
    }

    const fields = [];
    if (typeof query?.fields !== 'undefined') {
      fields.push(...query.fields);
    }
    const result = await this.videosService.getVideos(
      where,
      payload,
      fields,
      dateFilters,
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
  ) {
    const result = await this.videosService.getNotes(videoId);
    return new ResponseEntity(
      result,
      `Notes for video ${videoId}`,
      HttpStatus.OK,
    );
  }
}
