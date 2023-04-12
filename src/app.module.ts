import { IsMultipleExist } from './utils/validators/is-multiple-exist.validator';
import { JwtHelperService } from 'src/helpers/jwt-helper.service';
import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import envValidationSchema from './helpers/validateEnv';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import DatabaseProvider from './database/database.provider';
import { DataSource } from 'typeorm';
import { RolesModule } from './app/roles/roles.module';
import appConfig from './config/app.config';
import UserModule from './app/users/user.module';
import AuthModule from './app/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt.guard';
import jwtConfig from './config/jwt.config';
import { RoutesModule } from './app/routes/routes.module';
import { RoutePermissionsModule } from './app/route_permission/route-permission.module';
import { CacheConfigService } from './cache/cache.config';
import cacheConfig from './config/cache.config';
import { IsExist } from './utils/validators/is-exists.validator';
import { IsNotExist } from './utils/validators/is-not-exists.validator';
import ContractModule from './app/contract/contract.module';
import TagsModule from './app/tags/tags.module';
import BusinessModule from './app/business/business.module';
import VideosModule from './app/videos/videos.module';
import { NotesModule } from './app/notes/notes.module';
import { AlertsSeeder } from './seeders/alerts.seeder';
import ChannelModule from './app/channels/channels.module';
import CurrencyModule from './app/currency/currency.module';
import { AlertsModule } from './app/alerts/alerts.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import PaymentsModule from './app/payments/payments.module';
import { ScheduleModule } from '@nestjs/schedule';

const envFilePath = path.resolve(
  __dirname,
  `../env/${process.env.NODE_ENV}.env`,
);
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath,
      load: [databaseConfig, appConfig, jwtConfig, cacheConfig],
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: DatabaseProvider,
      dataSourceFactory: async (options) => {
        const dataSource = new DataSource(options);
        await dataSource.initialize();
        return dataSource;
      },
    }),
    EventEmitterModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useClass: CacheConfigService,
      inject: [ConfigService],
    }),
    UserModule,
    RolesModule,
    AuthModule,
    RoutesModule,
    RoutePermissionsModule,
    ContractModule,
    TagsModule,
    BusinessModule,
    VideosModule,
    ChannelModule,
    CurrencyModule,
    NotesModule,
    AlertsModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    JwtHelperService,
    IsExist,
    IsNotExist,
    IsMultipleExist,
    AlertsSeeder,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
  constructor(private readonly alertsSeeder: AlertsSeeder) {}

  async onModuleInit() {
    await this.alertsSeeder.seed();
  }
}
