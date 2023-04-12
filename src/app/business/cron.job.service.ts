import { GetInfluencersReturnType } from './types/index';
import { plainToInstance } from 'class-transformer';
import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import BusinessChannelEntity from 'src/app/business/entities/business.channel.entity';
import BusinessEntity from './entities/business.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBusinessDto } from './dto/create-business.dto';
import { BusinessResponse } from './dto/business-response.dto';
import { BusinessChannelAlertsEntity } from '../alerts/entities/business_channel_alerts.entity';
import { AlertsEntity } from '../alerts/entities/alerts.entity';
import TagsEntity from '../tags/entities/tags.entity';
import ContractEntity from '../contract/entities/contract.entity';
import { AlertType, BusinessChannelType, TagType } from './types';
import { Alerts } from 'src/constants/alerts';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export default class CronJobService {
  constructor(
    @InjectRepository(BusinessChannelEntity)
    private businessChannelRepository: Repository<BusinessChannelEntity>,
    @InjectRepository(TagsEntity)
    private tagsRepository: Repository<TagsEntity>,
    private dataSource: DataSource,
  ) {}

  public async validateVideoCountCronJob() {
    
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
