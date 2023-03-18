import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../roles/entities/role.entity';
import { RolesModule } from '../roles/roles.module';
import { RolesService } from '../roles/roles.service';
import { RoutesEntity } from './entities/route.entity';
import { RoutesController } from './routes.controller';
import { RoutesRepository } from './routes.repository';
import { RoutesService } from './routes.service';
import { CacheService } from 'src/helpers/CacheService';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoutesEntity, RoleEntity]),
    RolesModule,
    ConfigModule,
  ],
  providers: [
    RoutesService,
    RoutesRepository,
    ConfigService,
    RolesService,
    CacheService,
  ],
  controllers: [RoutesController],
  exports: [RoutesModule, RoutesService],
})
export class RoutesModule {}
