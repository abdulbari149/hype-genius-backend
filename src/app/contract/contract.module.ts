import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ContractEntity from './entities/contract.entity';
import ContractController from './contract.controller';
import ContractService from './contract.service';
import UserModule from '../users/user.module';
import UserEntity from '../users/entities/user.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContractEntity, UserEntity]),
    forwardRef(() => UserModule),
  ],
  controllers: [ContractController],
  providers: [ContractService, IsExist],
  exports: [ContractService],
})
export default class ContractModule {}
