import { Module } from '@nestjs/common';
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
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath: path.resolve(__dirname, '../.env'),
      load: [databaseConfig, appConfig],
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
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
    JwtModule.registerAsync({
      useFactory(...args) {
        return Promise.resolve({
          secret: process.env.JWT_SECRET,
        });
      },
    }),
    UserModule,
    RolesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
