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

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => UserModule),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, IsExist, JwtHelperService, JwtService, JwtStrategy],
  exports: [AuthService],
})
export default class AuthModule {}
