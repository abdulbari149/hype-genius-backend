import { JwtService } from '@nestjs/jwt';
import UserEntity from '../users/entities/user.entity';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import { IsExist } from '../../utils/validators/is-exists.validator';
import UserModule from '../users/user.module';
import { JwtHelperService } from '../../helpers/jwt-helper.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, IsExist, JwtHelperService, JwtService],
  exports: [AuthService],
})
export default class AuthModule {}
