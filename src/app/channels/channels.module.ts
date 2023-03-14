import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ChannelEntity from './entities/channels.entity';
import ChannelController from './channels.controller';
import ChannelService from './channels.service';
import UserModule from '../users/user.module';
import UserEntity from '../users/entities/user.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelEntity, UserEntity]),
    forwardRef(() => UserModule),
  ],
  controllers: [ChannelController],
  providers: [ChannelService, IsExist],
  exports: [ChannelService],
})
export default class ChannelModule {}
