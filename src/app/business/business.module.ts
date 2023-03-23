import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import BusinessEntity from './entities/business.entity';
import BusinessController from './business.controller';
import BusinessService from './business.service';
import BusinessChannelEntity from 'src/app/business/entities/business.channel.entity';
import UserModule from '../users/user.module';
import UserEntity from '../users/entities/user.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BusinessEntity,
      UserEntity,
      BusinessChannelEntity,
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [BusinessController],
  providers: [BusinessService, IsExist],
  exports: [BusinessService],
})
export default class BusinessModule {}
