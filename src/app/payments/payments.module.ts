import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PaymentsEntity from './entities/payments.entity';
import PaymentsController from './payments.controller';
import PaymentsService from './payments.service';
import UserModule from '../users/user.module';
import UserEntity from '../users/entities/user.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentsEntity, UserEntity]),
    forwardRef(() => UserModule),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, IsExist],
  exports: [PaymentsService],
})
export default class PaymentsModule {}
