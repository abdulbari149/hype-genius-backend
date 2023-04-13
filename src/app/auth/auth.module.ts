import ChannelEntity from 'src/app/channels/entities/channels.entity';
import { JwtService } from '@nestjs/jwt';
import UserEntity from '../users/entities/user.entity';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import { IsExist } from '../../utils/validators/is-exists.validator';
import UserModule from '../users/user.module';
import { JwtHelperService } from '../../helpers/jwt-helper.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/startegies/jwt.startegy';
import { CacheService } from 'src/helpers/CacheService';
import { RoleRepository } from '../roles/role.repository';
import BusinessEntity from '../business/entities/business.entity';
import BusinessModule from '../business/business.module';
import ChannelModule from '../channels/channels.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, BusinessEntity, ChannelEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => BusinessModule),
    forwardRef(() => ChannelModule),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    IsExist,
    JwtHelperService,
    JwtService,
    CacheService,
    JwtStrategy,
    RoleRepository,
  ],
  exports: [AuthService],
})
export default class AuthModule {}
