import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTagsDto } from './dto/create-tags.dto';
import TagsService from './tags.service';

@Controller({
  path: '/tags',
  version: '1',
})
export default class TagsController {
  constructor(private tagsService: TagsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  async CreateTag(@Body() body: CreateTagsDto) {
    const response = await this.tagsService.CreateTag(body);
    return { ...response, message: 'Created' };
  }

  @HttpCode(HttpStatus.CREATED)
  @Put('/activate/:tag_id')
  async ActivateTag(@Param('tag_id') tag_id: number) {
    const response = await this.tagsService.ActivateTag(tag_id);
    return { ...response, message: 'Activated tag' };
  }

  @Get(':business_channel_id')
  async GetTags(@Param('business_channel_id') business_channel_id: number) {
    const tags = await this.tagsService.GetTags(business_channel_id);
    return tags;
  }
}
