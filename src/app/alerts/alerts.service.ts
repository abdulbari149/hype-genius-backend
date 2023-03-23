import { Injectable } from '@nestjs/common';
import { AlertsRepository } from './alerts.repository';

@Injectable()
export class AlertsService {
  constructor(private alertsRepository: AlertsRepository) {}
}
