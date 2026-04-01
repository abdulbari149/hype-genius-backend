import { plainToInstance } from 'class-transformer';
import { AlertsEntity } from '../app/alerts/entities/alerts.entity';
import { Alerts, AlertsPriority } from '../constants/alerts';
import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
export class AlertsSeeder implements Seeder {
  async run(factory: Factory, dataSource: DataSource) {
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

    const query_runner = dataSource.createQueryRunner();
    try {
      await query_runner.connect();
      await query_runner.startTransaction();
      for (const a of alerts) {
        const exists = await query_runner.manager.findOne(AlertsEntity, {
          where: { name: a.name },
        });
        if (!exists) {
          await query_runner.manager.save(plainToInstance(AlertsEntity, a));
        }
      }
      await query_runner.commitTransaction();
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw error;
    } finally {
      await query_runner.release();
    }
  }
}
