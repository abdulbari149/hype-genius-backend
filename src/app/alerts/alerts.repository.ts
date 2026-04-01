import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AlertsEntity } from './entities/alerts.entity';

@Injectable()
export class AlertsRepository extends Repository<AlertsEntity> {
  constructor(private dataSource: DataSource) {
    super(AlertsEntity, dataSource.createEntityManager());
  }
}
