import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import BusinessChannelEntity from 'src/app/business/entities/business.channel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import TagsEntity from '../tags/entities/tags.entity';
import { Injectable, Logger } from '@nestjs/common';

import { Cron, CronExpression } from '@nestjs/schedule';
import ContractEntity from '../contract/entities/contract.entity';
import * as moment from 'moment';
import { Alerts } from 'src/constants/alerts';
import { AlertsEntity } from '../alerts/entities/alerts.entity';
import { number } from 'joi';
import { BusinessChannelAlertsEntity } from '../alerts/entities/business_channel_alerts.entity';

@Injectable()
export default class BusinessCronService {
  private readonly logger = new Logger(BusinessCronService.name);
  constructor(
    @InjectRepository(BusinessChannelEntity)
    private businessChannelRepository: Repository<BusinessChannelEntity>,
    @InjectRepository(BusinessChannelAlertsEntity)
    private businessChannelAlertsRepository: Repository<BusinessChannelAlertsEntity>,
    @InjectRepository(AlertsEntity)
    private alertsRepository: Repository<AlertsEntity>,
  ) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  public async handleCron() {
    const prevMonthDate = moment().subtract(1, 'months');
    const firstDateOfPrevMonth = prevMonthDate
      .startOf('months')
      .add(1, 'days')
      .format('YYYY-MM-DD');
    const lastDateOfPrevMonth = prevMonthDate
      .endOf('months')
      .format('YYYY-MM-DD');
    console.log({ firstDateOfPrevMonth, lastDateOfPrevMonth });
    const uploadFreqAlert = await this.alertsRepository.findOne({
      where: { name: Alerts.UPLOAD_FREQ },
      loadEagerRelations: false,
      select: { id: true },
    });
    const data = await this.businessChannelRepository
      .createQueryBuilder('bc')
      .select([
        'bc.id as id',
        'vc.video_count as video_count',
        `case
          when c.upload_frequency = 'unlimited' then null
          else CAST(replace(c.upload_frequency, 'x', '') as INTEGER)
        end as upload_frequency`,
      ])
      .innerJoin(
        (subQuery: SelectQueryBuilder<any>) => {
          return subQuery
            .select([
              'vbc.id as business_channel_id',
              'count(v.id) as video_count',
            ])
            .from(BusinessChannelEntity, 'vbc')
            .innerJoin('vbc.videos', 'v')
            .where(
              'cast(v.created_at as date) >= :first_date and cast(v.created_at as date) <= :last_date',
              {
                first_date: firstDateOfPrevMonth,
                last_date: lastDateOfPrevMonth,
              },
            )
            .groupBy('vbc.id');
        },
        'vc',
        'vc.business_channel_id = bc.id',
      )
      .innerJoin('bc.contract', 'c')
      .getRawMany<{
        id: number;
        video_count: number;
        upload_frequency: number | null;
      }>();

    await Promise.all(
      data.map((item) => {
        return new Promise(async (resolve, reject) => {
          try {
            if (
              item.upload_frequency !== null &&
              item.upload_frequency > item.video_count
            ) {
              await this.businessChannelAlertsRepository
                .create({
                  alert_id: uploadFreqAlert.id,
                  business_channel_id: item.id,
                })
                .save();
              resolve(item);
            }
            resolve(null);
          } catch (error) {
            reject(error);
          }
        });
      }),
    );
    // return count;
  }
}
