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
export default class BusinessService {
  constructor(
    @InjectRepository(BusinessEntity)
    private businessRepository: Repository<BusinessEntity>,
    @InjectRepository(BusinessChannelEntity)
    private businessChannelRepository: Repository<BusinessChannelEntity>,
    @InjectRepository(BusinessChannelAlertsEntity)
    private businessChannelAlertsRepository: Repository<BusinessChannelAlertsEntity>,
    @InjectRepository(TagsEntity)
    private tagsRepository: Repository<TagsEntity>,
    @InjectRepository(ContractEntity)
    private contractRepository: Repository<ContractEntity>,
    private dataSource: DataSource,
  ) {}

  public async createBusiness(data: CreateBusinessDto, admin_id: number) {
    const businessExists = await this.businessRepository.findOne({
      where: { name: data.name },
    });
    if (!businessExists) {
      throw new ConflictException('Business already exists');
    }
    const business = plainToInstance(BusinessEntity, { ...data, admin_id });
    return await this.businessRepository.save(business);
  }

  public async getAllBusiness(userId: number) {
    const data = await this.dataSource
      .getRepository(BusinessChannelEntity)
      .find({
        where: { userId },
        loadEagerRelations: false,
        relations: { business: true },
      });
    return plainToInstance(
      BusinessResponse,
      data.map((item) => item.business),
    );
  }
  public async getChannels(businessId: number) {
    const businessChannelsQuery = this.businessChannelRepository
      .createQueryBuilder('bc')
      .select([
        'bc.id as id',
        'bc.business_id as business_id',
        'bc.channel_id as channel_id',
        `jsonb_build_object(
          'id', influencer.id, 
          'firstName', influencer.first_name, 
          'lastName', influencer.last_name,
          'email', influencer.email,
          'phoneNumber', influencer.phone_number,
          'createdAt', influencer.created_at,
          'updatedAt', influencer.updated_at,
          'deletedAt', influencer.deleted_at
        ) as influencer`,
        `jsonb_build_object(
          'id', channel.id, 
          'name', channel.name, 
          'link', channel.link,
          'influencerId', channel.influencer_id,
          'createdAt', channel.created_at,
          'updatedAt', channel.updated_at,
          'deletedAt', channel.deleted_at
        ) as channel`,

        `CASE
          WHEN contract.id is NULL THEN NULL 
          ELSE jsonb_build_object(
            'id', contract.id, 
            'isOneTime', contract.is_one_time, 
            'amount', contract.amount,
            'currencyId', contract.currency_id,
            'uploadFrequency', contract.upload_frequency,
            'createdAt', contract.created_at,
            'updatedAt', contract.updated_at,
            'deletedAt', contract.deleted_at
          )
        END as contract`,
      ])
      .innerJoin('bc.channel', 'channel')
      .innerJoin('channel.user', 'influencer')
      .leftJoin('bc.contract', 'contract')
      .where('bc.business_id=:businessId', { businessId });

    const alertsQuery = this.businessChannelAlertsRepository
      .createQueryBuilder('bca')
      .select([
        'bca.business_channel_id as "businessChannelId"',
        'a.id as id',
        'a.priority as priority',
        'a.name as name',
        'a.color as color',
        'a.created_at as "createdAt"',
        'a.updated_at as "updatedAt"',
        'a.deleted_at as "deletedAt"',
      ])
      .innerJoin('bca.alert', 'a')
      .innerJoin(
        (subQuery: SelectQueryBuilder<any>) => {
          return subQuery
            .select([
              'sub_bca.business_channel_id as bca_id',
              'max(sub_a.priority) as priority',
            ])
            .from(AlertsEntity, 'sub_a')
            .innerJoin('sub_a.business_channel_alerts', 'sub_bca')
            .innerJoin('sub_bca.businessChannel', 'bc')
            .where('bc.business_id=:businessId', { businessId })
            .groupBy('sub_bca.business_channel_id');
        },
        'max_bca',
        'max_bca.bca_id = bca.business_channel_id and max_bca.priority = a.priority',
      );

    const tagsQuery = this.tagsRepository
      .createQueryBuilder('t')
      .select([
        't.id as id',
        't.name as name',
        't.color as color',
        't.created_at as "createdAt"',
        't.updated_at as "updatedAt"',
        't.deleted_at as "deletedAt"',
        't.business_channel_id as "businessChannelId"',
      ])
      .innerJoin('t.business_channels', 'bc')
      .where('bc.business_id=:businessId', { businessId });

    const [businessChannels, alerts, tags] = await Promise.all([
      businessChannelsQuery.getRawMany<BusinessChannelType>(),
      alertsQuery.getRawMany<AlertType>(),
      tagsQuery.getRawMany<TagType>(),
    ]);

    const tagsMap = new Map<number, TagType[]>();
    const alertsMap = new Map<number, AlertType>();
    alerts.forEach((alert) => {
      alertsMap.set(alert.businessChannelId, alert);
    });

    tags.forEach((tag) => {
      if (!tagsMap.has(tag.businessChannelId)) {
        tagsMap.set(tag.businessChannelId, [tag]);
      } else {
        const prevTags = tagsMap.get(tag.businessChannelId);
        tagsMap.set(tag.businessChannelId, [...prevTags, tag]);
      }
    });

    return businessChannels.map<GetInfluencersReturnType>((businessChannel) => {
      const alert = alertsMap.get(businessChannel.id) ?? null;
      const tags = tagsMap.get(businessChannel.id) ?? null;
      let paymentStatus: GetInfluencersReturnType['paymentStatus'] = undefined;
      if (alert && alert.name === Alerts.PAYMENT_DUE) {
        paymentStatus = 'unpaid';
      } else if (alert && alert.name === Alerts.MISSING_DEAL) {
        paymentStatus = undefined;
      } else if (alert) {
        paymentStatus = 'paid';
      }
      return {
        ...businessChannel,
        alert,
        tags,
        paymentStatus,
      };
    });
  }

  public async getBusiness(id: number) {
    const business = await this.businessRepository.findOne({
      where: { id },
      loadEagerRelations: false,
    });
    return plainToInstance(BusinessResponse, {
      ...business,
    });
  }
  public async updateBusiness(business_id: number, body: UpdateBusinessDto) {
    try {
      const business = await this.businessRepository.update(business_id, body);
      return business;
    } catch (error) {
      throw error;
    }
  }
}
