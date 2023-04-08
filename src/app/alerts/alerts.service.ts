import { Injectable, NotFoundException } from '@nestjs/common';
import { AlertsRepository } from './alerts.repository';
import { DataSource } from 'typeorm';
import BusinessChannelEntity from '../business/entities/business.channel.entity';
import { BusinessChannelAlertsEntity } from './entities/business_channel_alerts.entity';
import { JwtAccessPayload } from '../auth/auth.interface';

@Injectable()
export class AlertsService {
  constructor(
    private alertsRepository: AlertsRepository,
    private dataSource: DataSource,
  ) {}
  public async getBusinessChannelAlerts(
    payload: JwtAccessPayload & { business_channel_id: number },
  ) {
    const business_channel = await this.dataSource
      .getRepository(BusinessChannelEntity)
      .find({
        where: {
          businessId: payload.business_id,
          id: payload.business_channel_id,
        },
      });

    if (!business_channel) {
      throw new NotFoundException('No business-channel found');
    }
    const businessChannelAlerts = await this.dataSource
      .getRepository(BusinessChannelAlertsEntity)
      .find({
        where: { business_channel_id: payload.business_channel_id },
        loadEagerRelations: false,
        relations: { alert: true },
        order: { alert: { priority: 'DESC' } },
      });
    return businessChannelAlerts.map((businessChannelAlert) => ({
      ...businessChannelAlert.alert,
      id: businessChannelAlert.id,
      alertId: businessChannelAlert.alert_id,
    }));
  }
}
