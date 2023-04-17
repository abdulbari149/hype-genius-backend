import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import TagsEntity from './entities/tags.entity';
import TagsController from './tags.controller';
import TagsService from './tags.service';
import UserModule from '../users/user.module';
import UserEntity from '../users/entities/user.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import BusinessChannelEntity from '../business/entities/business.channel.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TagsEntity, UserEntity, BusinessChannelEntity]),
    forwardRef(() => UserModule),
  ],
  controllers: [TagsController],
  providers: [TagsService, IsExist],
  exports: [TagsService],
})
export default class TagsModule {}
