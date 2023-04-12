import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import BusinessEntity from './entities/business.entity';
import BusinessController from './business.controller';
import BusinessService from './business.service';
import BusinessChannelEntity from 'src/app/business/entities/business.channel.entity';
import UserModule from '../users/user.module';
import UserEntity from '../users/entities/user.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { BusinessChannelAlertsEntity } from '../alerts/entities/business_channel_alerts.entity';
import ContractEntity from 'src/app/contract/entities/contract.entity';
import TagsEntity from 'src/app/tags/entities/tags.entity';
import UploadFrequencyCronJob from './upload.frequency.cron';
import CronJobService from './cron.job.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      BusinessEntity,
      UserEntity,
      BusinessChannelEntity,
      BusinessChannelAlertsEntity,
      TagsEntity,
      ContractEntity,
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [BusinessController],
  providers: [BusinessService, IsExist, UploadFrequencyCronJob, CronJobService],
  exports: [BusinessService],
})
export default class BusinessModule {}
