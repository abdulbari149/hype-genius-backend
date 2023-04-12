import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { resolve } from 'path';
@Injectable()
export default class DatabaseProvider implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return Promise.resolve({
      type: 'postgres',
      database: this.configService.get('database.name'),
      port: this.configService.get('database.port'),
      host: this.configService.get('database.host'),
      username: this.configService.get('database.user'),
      password: this.configService.get('database.password'),
      autoLoadEntities: true,
      entities: [resolve(__dirname, '../app/**/**/entities/*.entity.{ts,js}')],
      synchronize: this.configService.get('database.sync'),
      connectTimeoutMS: 5000,
      ssl: false,
      logging: true,
      maxQueryExecutionTime: 2000,
      poolSize: 1024,
    });
  }
}
