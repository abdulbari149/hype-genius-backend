import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { CreateTagsDto } from './dto/create-tags.dto';
import TagsService from './tags.service';
import { Request } from 'express';

@Controller({
  path: '/tags',
  version: '1',
})
export default class TagsController {
  constructor(private tagsService: TagsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  async CreateTag(@Body() body: CreateTagsDto, @Req() req: Request) {
    try {
      const response = await this.tagsService.CreateTag({ ...body }, req);
      return { ...response, message: 'Created' };
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Put('/activate/:tag_id')
  async ActivateTag(@Param('tag_id') tag_id: number) {
    try {
      const response = await this.tagsService.ActivateTag(tag_id);
      return { ...response, message: 'Activated tag' };
    } catch (error) {
      throw error;
    }
  }

  @Get(':business_channel_id')
  async GetTags(@Param('business_channel_id') business_channel_id: number) {
    try {
      const tags = await this.tagsService.GetTags(business_channel_id);
      return tags;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
