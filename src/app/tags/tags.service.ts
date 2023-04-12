import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import TagsEntity from './entities/tags.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagsDto } from './dto/create-tags.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export default class TagsService {
  constructor(
    @InjectRepository(TagsEntity)
    private tagsRepository: Repository<TagsEntity>,
    private dataSource: DataSource,
  ) {}
  public async CreateTag(body: CreateTagsDto) {
    const query_runner = this.dataSource.createQueryRunner();
    await query_runner.startTransaction();
    try {
      const mapped_tag = plainToInstance(TagsEntity, body);
      const response = await query_runner.manager.save(mapped_tag);
      await query_runner.commitTransaction();
      return response;
    } catch (error) {
      throw error;
    } finally {
      await query_runner.release();
    }
  }

  public async ActivateTag(tag_id: number) {
    const query_runner = this.dataSource.createQueryRunner();
    await query_runner.startTransaction();
    try {
      const tag = await query_runner.manager.findOne(TagsEntity, {
        where: { id: tag_id },
      });
      const mapped_tag = plainToInstance(TagsEntity, { is_activated: true });
      const response = await query_runner.manager.save(TagsEntity, {
        ...tag,
        ...mapped_tag,
      });
      await query_runner.commitTransaction();
      return response;
    } catch (error) {
      throw error;
    } finally {
      await query_runner.release();
    }
  }

  public async GetTags(business_channel_id: number) {
    try {
      const tag = await this.tagsRepository.find({
        where: { business_channel_id },
      });
      return tag;
    } catch (error) {
      throw error;
    }
  }

  public async GetAllTags() {
    try {
      const tag = await this.tagsRepository.find();
      return tag;
    } catch (error) {
      throw error;
    }
  }
}
