import { DataSource, Repository } from 'typeorm';
import BusinessChannelEntity from 'src/app/business/entities/business.channel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import TagsEntity from '../tags/entities/tags.entity';
import { Injectable, Logger } from '@nestjs/common';

import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export default class BusinessCronService {
  private readonly logger = new Logger(BusinessCronService.name);
  constructor(
    @InjectRepository(BusinessChannelEntity)
    private businessChannelRepository: Repository<BusinessChannelEntity>,
    @InjectRepository(TagsEntity)
    private tagsRepository: Repository<TagsEntity>,
    private dataSource: DataSource,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const count = await this.businessChannelRepository
      .createQueryBuilder('bc')
      .select('bc.id', 'business_channel_id')
      .addSelect('COUNT(v.id)', 'video_count')
      .innerJoin('bc.videos', 'v')
      .where('v.createdAt >= :oneMonthAgo', { oneMonthAgo })
      .andWhere(
        'EXTRACT(MONTH FROM v.createdAt) = EXTRACT(MONTH FROM :oneMonthAgo)',
        { oneMonthAgo },
      )
      .andWhere(
        'EXTRACT(YEAR FROM v.createdAt) = EXTRACT(YEAR FROM :oneMonthAgo)',
        { oneMonthAgo },
      )
      .groupBy('bc.id')
      .getRawMany();
    return count;
  }
}
