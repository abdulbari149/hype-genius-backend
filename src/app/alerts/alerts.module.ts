import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { AlertsRepository } from './alerts.repository';
import { AlertsEntity } from './entities/alerts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AlertsEntity])],
  providers: [AlertsService, AlertsRepository],
  controllers: [AlertsController],
  exports: [AlertsService],
})
export class AlertsModule {}
