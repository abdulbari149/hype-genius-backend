import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
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
  @Get('/')
  async getBusinessChannelAlert(
    @Payload() payload: JwtAccessPayload,
    @Query('business_channel_id') business_channel_id: number,
  ) {
    if (!business_channel_id) {
      throw new BadRequestException(
        'business_channel_id is required in query params',
      );
    }
    const result = await this.alertsService.getBusinessChannelAlerts({
      business_channel_id,
      ...payload,
    });
    return new ResponseEntity(result);
  }
}
