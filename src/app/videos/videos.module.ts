import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import VideosEntity from './entities/videos.entity';
import VideosController from './videos.controller';
import VideosService from './videos.service';
import UserModule from '../users/user.module';
import UserEntity from '../users/entities/user.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideosEntity, UserEntity]),
    forwardRef(() => UserModule),
  ],
  controllers: [VideosController],
  providers: [VideosService, IsExist],
  exports: [VideosService],
})
export default class VideosModule {}
