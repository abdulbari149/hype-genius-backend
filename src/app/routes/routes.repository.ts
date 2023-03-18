import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RoutesEntity } from './entities/route.entity';

@Injectable()
export class RoutesRepository extends Repository<RoutesEntity> {
  constructor(private dataSource: DataSource) {
    super(RoutesEntity, dataSource.createEntityManager());
  }
}
