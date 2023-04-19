import { plainToInstance } from 'class-transformer';
import { RoleEntity } from '../app/roles/entities/role.entity';
import ROLES from '../constants/roles';
import { DataSource } from 'typeorm';
import * as routes from './data/routes.json';
import { RoutesEntity } from '../app/routes/entities/route.entity';
import { RoutePermissionsEntity } from '../app/route_permission/entities/route-permission.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export class RolesSeeder implements Seeder {
  async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const roles = [
      {
        role: ROLES.SUPER_ADMIN,
      },
      {
        role: ROLES.BUSINESS_ADMIN,
      },
      {
        role: ROLES.INFLUENCER,
      },
    ];
    const query_runner = dataSource.createQueryRunner();
    try {
      await query_runner.startTransaction();
      const roles_entity = plainToInstance(RoleEntity, roles);
      const roles_data = await query_runner.manager.save(roles_entity);
      console.log({
        roles: roles_data,
      });
      const roles_map = new Map();
      for (const role of roles_data) {
        roles_map.set(role.role, role.id);
      }
      const routes_entity = plainToInstance(
        RoutesEntity,
        routes.map((route) => ({
          end_point: route.end_point,
          request_type: route.request_type,
        })),
      );
      const routes_data = await query_runner.manager.save(routes_entity);
      const route_permissions = [];
      for (const route of routes_data) {
        const item = routes.find(
          (r) =>
            r.end_point === route.end_point &&
            r.request_type === route.request_type,
        );
        const route_permission = item.roles.map((role) => {
          return {
            route_id: route.id,
            role_id: roles_map.get(role),
          };
        });
        route_permissions.push(...route_permission);
      }
      await query_runner.manager.save(
        plainToInstance(RoutePermissionsEntity, route_permissions),
      );
      await query_runner.commitTransaction();
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw error;
    } finally {
      await query_runner.release();
    }
  }
}
