import { plainToInstance } from 'class-transformer';
import { RoleEntity } from '../app/roles/entities/role.entity';
import ROLES from '../constants/roles';
import { DataSource, EntityManager, In } from 'typeorm';
import routes from './data/routes.json';
import { RoutesEntity } from '../app/routes/entities/route.entity';
import { RoutePermissionsEntity } from '../app/route_permission/entities/route-permission.entity';
import { Factory, Seeder } from 'typeorm-seeding';

const ROLE_NAMES = [
  ROLES.SUPER_ADMIN,
  ROLES.BUSINESS_ADMIN,
  ROLES.INFLUENCER,
] as const;

export class RolesSeeder implements Seeder {
  async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const query_runner = dataSource.createQueryRunner();
    try {
      await query_runner.connect();
      await query_runner.startTransaction();

      const roles_map = await this.ensureRoles(query_runner.manager);

      for (const routeDef of routes) {
        let route = await query_runner.manager.findOne(RoutesEntity, {
          where: {
            end_point: routeDef.end_point,
            request_type: routeDef.request_type,
          },
        });
        if (!route) {
          route = await query_runner.manager.save(
            plainToInstance(RoutesEntity, {
              end_point: routeDef.end_point,
              request_type: routeDef.request_type,
            }),
          );
        }

        for (const roleName of routeDef.roles) {
          const role_id = roles_map.get(roleName);
          if (role_id === undefined) continue;

          const existingPerm = await query_runner.manager.findOne(
            RoutePermissionsEntity,
            {
              where: { route_id: route.id, role_id },
            },
          );
          if (!existingPerm) {
            await query_runner.manager.save(
              plainToInstance(RoutePermissionsEntity, {
                route_id: route.id,
                role_id,
              }),
            );
          }
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

  private async ensureRoles(
    manager: EntityManager,
  ): Promise<Map<string, number>> {
    const existing = await manager.find(RoleEntity, {
      where: { role: In([...ROLE_NAMES]) },
    });
    const byRole = new Map(existing.map((r) => [r.role, r]));

    for (const roleName of ROLE_NAMES) {
      if (!byRole.has(roleName)) {
        const saved = await manager.save(
          plainToInstance(RoleEntity, { role: roleName }),
        );
        byRole.set(roleName, saved);
      }
    }

    return new Map(
      [...byRole.entries()].map(([role, entity]) => [role, entity.id]),
    );
  }
}
