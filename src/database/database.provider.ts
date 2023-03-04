import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModule,
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export default class DatabaseProvider implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(
    connectionName?: string,
  ): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return Promise.resolve({
      type: 'postgres',
      database: this.configService.get('database.name'),
      port: this.configService.get('database.port'),
      host: this.configService.get('database.host'),
      username: this.configService.get('database.user'),
      password: this.configService.get('database.password'),
      autoLoadEntities: true,
      entities: [__dirname + '../app/**/*.entity.{ts,js}'],
      synchronize: this.configService.get('database.sync'),
      connectTimeoutMS: 1000,
      ssl: false,
    });
  }

}
