import { GetInfluencersReturnType, VideoType } from './types/index';
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
import VideosEntity from '../videos/entities/videos.entity';
import { GetBusinessReportQueryDto } from './dto/get-business-report-query.dto';

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
    @InjectRepository(VideosEntity)
    private videosRepository: Repository<VideosEntity>,
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
      relations: { default_currencies: true },
    });
    return plainToInstance(BusinessResponse, {
      ...business,
      default_currency: business.default_currencies,
    });
  }
  public async updateBusiness(id: number, data: UpdateBusinessDto) {
    const business = await this.businessRepository.findOne({
      where: { id },
      loadEagerRelations: false,
    });
    if (!business) {
      throw new ConflictException('Business not found');
    }
    const businessData = plainToInstance(BusinessEntity, {
      ...business,
      ...data,
    });
    return await this.businessRepository.save(businessData);
  }

  public async getBusinessReport(
    businessId: number,
    query: GetBusinessReportQueryDto,
  ) {
    const business = await this.businessRepository.findOne({
      where: {
        id: businessId,
      },
      loadEagerRelations: false,
    });

    const pagination = {
      size: 0,
      page: 0,
      offset: 0,
    };
    pagination.page = query?.page ? parseInt(query?.page.toString(), 10) : 0;
    if (typeof query?.size !== 'undefined') {
      pagination.size = query.size;
    }

    let businessChannelsQuery = this.businessChannelRepository
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
      ])
      .innerJoin('bc.channel', 'channel')
      .innerJoin('channel.user', 'influencer')
      .where('bc.business_id=:businessId', { businessId });
    console.log(query);

    if (
      typeof query?.business_channel_id !== 'undefined' &&
      (typeof query?.report_for_all === 'undefined' || !query.report_for_all)
    ) {
      pagination.size = 1;
      pagination.page = 1;
      pagination.offset = 0;
      businessChannelsQuery = businessChannelsQuery.andWhere(
        'bc.id = :business_channel_id',
        { business_channel_id: query.business_channel_id },
      );
    }
    const businessChannelCount = await businessChannelsQuery.getCount();

    const totalNoOfPages = Math.ceil(businessChannelCount / pagination.size);

    if (pagination.page !== 0 && pagination.size !== 0) {
      pagination.offset = (pagination.page - 1) * pagination.size;
      businessChannelsQuery = businessChannelsQuery
        .limit(pagination.size)
        .offset(pagination.offset);
    }
    const businessChannels = await businessChannelsQuery.getRawMany<
      Omit<BusinessChannelType, 'contract' | 'channel'>
    >();

    const businessChannelReportPromises = businessChannels.map((bc) => {
      return new Promise(async (resolve, reject) => {
        try {
          const videos = await this.videosRepository
            .createQueryBuilder('v')
            .select([
              'v.id as id',
              'v.title as title',
              'v.views as views',
              'v.is_payment_due as is_payment_due',
              'v.payment_id as payment_id',
              `CASE WHEN p.business_amount is NULL THEN 0::INTEGER ELSE p.business_amount::INTEGER  END as amount`,
              `CASE WHEN p.business_amount is NULL THEN 0::FLOAT ELSE ROUND((v."views" * ${
                business.acrvv / 100
              } * ${
                business.customer_ltv
              }) / p.business_amount,2)::FLOAT  END as roas`,
              'v.created_at as "createdAt"',
              'v.updated_at as "updatedAt"',
              'v.deleted_at as "deletedAt"',
            ])
            .leftJoin('v.payments', 'p')
            .where('v.business_channel_id=:bc_id', {
              bc_id: bc.id,
              acrvv: business.acrvv / 100,
              customer_ltv: parseInt(business.customer_ltv.toString(), 10),
            })
            .getRawMany<VideoType>();
          const data = videos.reduce(
            (acc, video) => {
              return {
                totalViews: video.views + acc.totalViews,
                totalAmount:
                  video.amount === 0
                    ? acc.totalAmount
                    : acc.totalAmount + video.amount,
                avgRoas: acc.avgRoas + video.roas,
                roasCount: video.roas !== 0 ? acc.roasCount + 1 : acc.roasCount,
              };
            },
            { totalViews: 0, totalAmount: 0, avgRoas: 0, roasCount: 0 },
          );
          resolve({
            ...bc,
            total: {
              views: data.totalViews,
              amount: data.totalAmount,
              roas:
                data.roasCount !== 0
                  ? +parseFloat(
                      (data.avgRoas / data.roasCount).toString(),
                    ).toFixed(2)
                  : 0,
              no_of_uploads: videos.length,
            },
            videos,
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    const data = await Promise.all(businessChannelReportPromises);
    return {
      reports: data,
      metadata: {
        ...pagination,
        totalNoOfPages,
      },
    };
  }

  public async getBusinessAnalytics(businessId: number) {
    const business = await this.getBusiness(businessId);
    const acrvv = business?.acrvv ? business.acrvv / 100 : 0.003;
    const videoAnalyticsQuery = this.videosRepository
      .createQueryBuilder('v')
      .select([
        'count(v.id)::integer as no_of_uploads',
        'sum(v.views::integer)::integer as total_views',
        'sum(p.business_amount) as spent',
        `round(avg((v.views::integer * ${acrvv} * ${business.customer_ltv})/ p.business_amount), 2) as roas`,
      ])
      .innerJoin('v.business_channels', 'bc')
      .leftJoin('v.payments', 'p')
      .where('bc.business_id=:businessId and bc.deleted_at IS NULL', {
        businessId,
      });
    const channelAnalyticsQuery = this.businessChannelRepository
      .createQueryBuilder('bc')
      .select('count(bc.id) as active_partners')
      .where('bc.business_id=:businessId', { businessId });
    const [video_data, channel_data] = await Promise.all([
      videoAnalyticsQuery.getRawOne(),
      channelAnalyticsQuery.getRawOne(),
    ]);
    return {
      no_of_uploads: video_data.no_of_uploads,
      total_views: video_data.total_views,
      spent: Number(video_data.spent),
      roas: Number(video_data.roas),
      active_partners: Number(channel_data.active_partners),
    };
  }
}
