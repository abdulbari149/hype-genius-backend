import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlertsEntity } from 'src/app/alerts/entities/alerts.entity';
import { Alerts, AlertsPriority } from 'src/constants/alerts';
import { DataSource, In, Repository } from 'typeorm';

@Injectable()
export class AlertsSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    const alerts = [
      {
        name: Alerts.MISSING_DEAL,
        color: '#FF2E2E80',
        priority: AlertsPriority.MISSING_DEAL,
      },
      {
        name: Alerts.PAYMENT_DUE,
        color: '#FFDE2E80',
        priority: AlertsPriority.PAYMENT_DUE,
      },
      {
        name: Alerts.NEW_VIDEO,
        color: '#A4F2FD',
        priority: AlertsPriority.NEW_VIDEO,
      },
      {
        name: Alerts.FOLLOW_UP,
        color: '#ABABAB80',
        priority: AlertsPriority.FOLLOW_UP,
      },
      {
        name: Alerts.UPLOAD_FREQ,
        color: '#FB2EFF80',
        priority: AlertsPriority.UPLOAD_FREQ,
      },
    ];

    const alertsRepository = this.dataSource.getRepository(AlertsEntity);

    const existingAlerts = await alertsRepository.find({
      where: {
        name: In(alerts.map((alert) => alert.name)),
      },
      loadEagerRelations: false,
    });
    const newAlerts = alerts.filter(
      (alert) =>
        !existingAlerts.some(
          (existingAlert) => existingAlert.name === alert.name,
        ),
    );

    if (newAlerts.length) {
      await alertsRepository
        .createQueryBuilder()
        .insert()
        .values(newAlerts)
        .execute();
    }
  }
}
