import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import CurrencyEntity from './entities/currency.entity';
import CurrencyService from './curreny.service';
import CurrencyController from './currency.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyEntity])],
  providers: [CurrencyService],
  controllers: [CurrencyController],
})
export default class CurrencyModule {}
