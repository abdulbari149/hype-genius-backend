import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import TagsEntity from './entities/tags.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagsDto } from './dto/create-tags.dto';
import { plainToInstance } from 'class-transformer';
import { JwtAccessPayload } from '../auth/auth.interface';
import BusinessChannelEntity from '../business/entities/business.channel.entity';
import { TagsResponse } from './dto/tags-response.dto';

@Injectable()
export default class TagsService {
  constructor(
    @InjectRepository(TagsEntity)
    private tagsRepository: Repository<TagsEntity>,
    @InjectRepository(BusinessChannelEntity)
    private businessChannelRepository: Repository<BusinessChannelEntity>,
    private dataSource: DataSource,
  ) {}
  public async create(
    manager: EntityManager,
    data: CreateTagsDto | Array<CreateTagsDto>,
  ) {
    let tags = [];
    if (Array.isArray(data)) {
      tags = data;
    } else {
      tags = [data];
    }
    const response = await this.tagsRepository.save(
      plainToInstance(TagsEntity, tags),
    );
    return response;
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

  public async get(
    manager: EntityManager,
    business_channel_id: number,
    payload: JwtAccessPayload,
  ) {
    const businesChannel = manager.findOne(BusinessChannelEntity, {
      where: { id: business_channel_id, businessId: payload.business_id },
      loadEagerRelations: false,
    });
    if (!businesChannel) {
      throw new NotFoundException('Business channel is not associted with you');
    }
    const tags = await manager.find(TagsEntity, {
      where: { business_channel_id },
      loadEagerRelations: false,
    });
    return plainToInstance(TagsResponse, tags);
  }

  public async updateMany(
    manager: EntityManager,
    data: Array<Partial<TagsEntity>>,
    condition: Array<keyof TagsEntity>,
  ) {
    return await Promise.all(
      data.map((item) => {
        const itemMap = new Map(Object.entries(item));
        const where: FindOptionsWhere<TagsEntity> = {};
        for (const key of condition) {
          const str_key = key.toString();
          if (itemMap.has(str_key)) {
            where[str_key] = itemMap.get(str_key);
          }
        }
        return new Promise(async (resolve, reject) => {
          const tag = await manager.findOne(TagsEntity, {
            where,
          });
          if (!tag) reject('Tag doesnt exist');
          const mapped_tag = plainToInstance(TagsEntity, {
            ...tag,
            ...item,
          });
          const upated_tag = await manager.save(TagsEntity, mapped_tag);
          resolve(upated_tag);
        });
      }),
    );
  }

  public async delete(
    manager: EntityManager,
    id: number | number[],
    business_channel_id: number,
  ) {
    let tagIds: number[] = [];
    if (Array.isArray(id)) {
      tagIds = id;
    } else {
      tagIds = [id];
    }
    await manager.softDelete(TagsEntity, {
      id: In(tagIds),
      business_channel_id,
    });
  }
}
