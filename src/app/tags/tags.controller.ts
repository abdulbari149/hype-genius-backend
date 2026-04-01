import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateTagsDto } from './dto/create-tags.dto';
import TagsService from './tags.service';
import { JwtAccessPayload } from '../auth/auth.interface';
import { Payload } from 'src/decorators/payload.decorator';
import ResponseEntity from 'src/helpers/ResponseEntity';
import { SaveTagsDto } from './dto/save-tags.dto';
import { DataSource } from 'typeorm';

@Controller({
  path: '/tags',
  version: '1',
})
export default class TagsController {
  constructor(
    private tagsService: TagsService,
    private dataSource: DataSource,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  async createTag(@Body() body: CreateTagsDto) {
    const query_runner = this.dataSource.createQueryRunner();
    try {
      await query_runner.startTransaction();
      const result = await this.tagsService.create(query_runner.manager, body);
      await query_runner.commitTransaction();
      return new ResponseEntity(
        result[0],
        'Tag Created Successfully',
        HttpStatus.CREATED,
      );
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw error;
    } finally {
      await query_runner.release();
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Put('/activate/:tag_id')
  async ActivateTag(@Param('tag_id') tag_id: number) {
    const response = await this.tagsService.ActivateTag(tag_id);
    return { ...response, message: 'Activated tag' };
  }

  @Get('/')
  async GetTags(
    @Query('business_channel_id') business_channel_id: number,
    @Payload() payload: JwtAccessPayload,
  ) {
    if (!business_channel_id) {
      throw new BadRequestException(
        'business_channel_id is required in query params',
      );
    }
    const query_runner = this.dataSource.createQueryRunner();
    try {
      await query_runner.startTransaction();
      const tags = await this.tagsService.get(
        query_runner.manager,
        business_channel_id,
        payload,
      );
      await query_runner.commitTransaction();
      return new ResponseEntity(tags, 'Tags List', HttpStatus.OK);
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw error;
    } finally {
      await query_runner.release();
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Put('/')
  async saveTags(
    @Body() body: SaveTagsDto,
    @Payload() payload: JwtAccessPayload,
  ) {
    const query_runner = this.dataSource.createQueryRunner();
    try {
      await query_runner.startTransaction();
      if (body.old_tags.length > 0) {
        const oldTags = body.old_tags.map((tag) => ({
          ...tag,
          business_channel_id: body.business_channel_id,
        }));
        await this.tagsService.updateMany(query_runner.manager, oldTags, [
          'id',
          'business_channel_id',
        ]);
      }

      if (body.new_tags.length > 0) {
        await this.tagsService.create(
          query_runner.manager,
          body.new_tags.map((tag) => ({
            ...tag,
            business_channel_id: body.business_channel_id,
          })),
        );
      }

      if (body.delete_tags.length > 0) {
        this.tagsService.delete(
          query_runner.manager,
          body.delete_tags.map((dt) => dt.id),
          body.business_channel_id,
        );
      }

      await query_runner.commitTransaction();
      const tags = await this.tagsService.get(
        query_runner.manager,
        body.business_channel_id,
        payload,
      );
      return new ResponseEntity(
        tags,
        'Tags has been saved Successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw error;
    } finally {
      await query_runner.release();
    }
  }
}
