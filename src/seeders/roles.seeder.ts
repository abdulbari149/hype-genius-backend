import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RoleEntity } from 'src/app/roles/entities/role.entity';
import ROLES from 'src/constants/roles';
import { DataSource, In } from 'typeorm';

@Injectable()
export class RolesSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    const roles = [ROLES.SUPER_ADMIN, ROLES.BUSINESS_ADMIN, ROLES.INFLUENCER];

    const rolesRepository = this.dataSource.getRepository(RoleEntity);

    const existingRoles = await rolesRepository.find({
      where: {
        role: In(roles),
      },
      loadEagerRelations: false,
    });
    const newroles = roles.filter(
      (role) =>
        !existingRoles.some((existingRole) => existingRole.role === role),
    );

    if (newroles.length) {
      await rolesRepository
        .createQueryBuilder()
        .insert()
        .values(
          plainToInstance(
            RoleEntity,
            newroles.map((role) => ({ role })),
          ),
        )
        .execute();
    }
  }
}
