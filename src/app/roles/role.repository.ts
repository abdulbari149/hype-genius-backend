import { Injectable } from '@nestjs/common';
import { RoleEntity } from './entities/role.entity';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class RoleRepository extends Repository<RoleEntity> {
  constructor(private dataSource: DataSource) {
    super(RoleEntity, dataSource.createEntityManager());
  }

  async GetPermissions(role: string) {
    return await this.createQueryBuilder('r')
      .select(['rt.request_type as request_type', 'rt.end_point as end_point'])
      .innerJoin('r.route_permissions', 'rp')
      .innerJoin('rp.routes', 'rt')
      .where(`r.name='${role}'`)
      .getRawMany();
  }
}
