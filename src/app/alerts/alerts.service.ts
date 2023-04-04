import { Injectable, NotFoundException } from '@nestjs/common';
import { AlertsRepository } from './alerts.repository';
import { DataSource } from 'typeorm';
import BusinessChannelEntity from '../business/entities/business.channel.entity';
import { BusinessChannelAlertsEntity } from './entities/business_channel_alerts.entity';

@Injectable()
export class AlertsService {
  constructor(
    private alertsRepository: AlertsRepository,
    private dataSource: DataSource,
  ) {}
  public async getBusinessChannelAlerts(
    userId: number,
    business_channel_id: number,
  ) {
    const business_channel = await this.dataSource
      .getRepository(BusinessChannelEntity)
      .find({
        where: { userId, id: business_channel_id },
      });

    if (!business_channel) {
      throw new NotFoundException('No business-channel found against user');
    }
    const business_channel_alerts = await this.dataSource
      .getRepository(BusinessChannelAlertsEntity)
      .find({
        where: { business_channel_id },
      });
    return business_channel_alerts;
  }
}
