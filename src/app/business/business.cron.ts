import { DataSource, Repository } from 'typeorm';
import BusinessChannelEntity from 'src/app/business/entities/business.channel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import TagsEntity from '../tags/entities/tags.entity';
import { Injectable, Logger } from '@nestjs/common';

import { Cron, CronExpression } from '@nestjs/schedule';
import ContractEntity from '../contract/entities/contract.entity';

@Injectable()
export default class BusinessCronService {
  private readonly logger = new Logger(BusinessCronService.name);
  constructor(
    @InjectRepository(BusinessChannelEntity)
    private businessChannelRepository: Repository<BusinessChannelEntity>,
    @InjectRepository(TagsEntity)
    private tagsRepository: Repository<TagsEntity>,
    private dataSource: DataSource,
    @InjectRepository(ContractEntity)
    private contractRepository: Repository<ContractEntity>,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  public async handleCron() {
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

    const contracts = await this.contractRepository.find();

    count.forEach((businessChannel) => {
      const contract = contracts.find(
        (c) => c.business_channel_id === businessChannel.business_channel_id,
      );
      if (contract && businessChannel.video_count < contract.upload_frequency) {
        businessChannel.uploadFrequencyMatch = false;
      } else {
        businessChannel.isUploadFrequencyMatch = true;
      }
    });

    return count;
  }
}
