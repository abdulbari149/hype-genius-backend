import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
  HttpException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DataSource, In, Repository } from 'typeorm';
import { RoutePermissionsEntity } from '../route_permission/entities/route-permission.entity';
import { CreateRoutesDto } from './dto/create-routes.dto';
import { RoutesResponse } from './dto/routes-response.dto';
import { RoutesEntity } from './entities/route.entity';
import { RoutesRepository } from './routes.repository';
import { ResponseMessage } from '../../common/messages';
import { RoleEntity } from '../roles/entities/role.entity';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../../helpers/CacheService';
import { InjectRepository } from '@nestjs/typeorm';

const { SERVER_ERROR } = ResponseMessage;

@Injectable()
export class RoutesService {
  constructor(
    private routesRepository: RoutesRepository,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    private dataSource: DataSource,
    private configService: ConfigService,
    private cacheService: CacheService,
  ) {}

  async Create(body: CreateRoutesDto): Promise<any> {
    const { roles, ...routeData } = body;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const routeExists = await queryRunner.manager.findOne(RoutesEntity, {
        where: { ...routeData },
        loadEagerRelations: false,
      });
      if (routeExists) {
        throw new ConflictException('Route already exists with the endpoint');
      }
      const route = plainToInstance(RoutesEntity, routeData);
      const routeDetails = await queryRunner.manager.save<RoutesEntity>(route);
      const routePermissions = roles.map((r) => {
        const route_role = new RoutePermissionsEntity();
        route_role.role_id = r;
        route_role.route_id = routeDetails.id;
        return route_role;
      });

      const permissions =
        queryRunner.manager.save<RoutePermissionsEntity>(routePermissions);

      const userRoles = await this.roleRepository.find({
        where: { id: In(roles) },
        select: { role: true },
        loadEagerRelations: false,
      });
      for (const role of userRoles) {
        const permission = await queryRunner.manager
          .getRepository(RoleEntity)
          .createQueryBuilder('r')
          .select([
            'route.request_type as request_type',
            'route.end_point as end_point',
          ])
          .innerJoin('r.route_permissions', 'rp')
          .innerJoin('rp.routes', 'route')
          .where(`r.role='${role.role}'`)
          .getRawMany();
        const setPermissions = this.cacheService.addToCache(
          `${role.role}_permissions`,
          JSON.stringify(permission),
          this.configService.get('cache.permissionsExpiry'),
        );
        await Promise.all([permissions, setPermissions]);
      }
      await queryRunner.commitTransaction();

      return plainToInstance(RoutesResponse, {
        ...routeDetails,
        user_roles: userRoles,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }
}
