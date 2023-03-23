import { Controller } from '@nestjs/common';
import { AlertsService } from './alerts.service';

@Controller({
  path: 'alerts',
  version: '1',
})
export class AlertsController {
  constructor(private alertsService: AlertsService) {}
}
