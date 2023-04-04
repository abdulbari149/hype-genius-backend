import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { Payload } from 'src/decorators/payload.decorator';
import { JwtAccessPayload } from '../auth/auth.interface';
import ResponseEntity from 'src/helpers/ResponseEntity';

@Controller({
  path: 'alerts',
  version: '1',
})
export class AlertsController {
  constructor(private alertsService: AlertsService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/:business_channel_id')
  async getBusinessChannelAlert(
    @Payload() payload: JwtAccessPayload,
    @Param('business_channel_id') id: number,
  ) {
    const result = await this.alertsService.getBusinessChannelAlerts(
      payload.user_id,
      id,
    );
    return new ResponseEntity(result);
  }
}
