import { JwtAccessPayload } from '../auth/auth.interface';
import { CronJob } from 'node-cron';
import { CustomRequest } from './../../types/index';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import BusinessService from './business.service';
import ResponseEntity from 'src/helpers/ResponseEntity';
import { Payload } from 'src/decorators/payload.decorator';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { GetBusinessReportQueryDto } from './dto/get-business-report-query.dto';
import CronJobService from './cron.job.service';

@Controller({
  path: '/business',
  version: '1',
})
export default class BusinessController {
  constructor(
    private businessService: BusinessService,
    private cronJobService: CronJobService,
  ) {
    new CronJob('0 0 1 * *', () => {
      this.cronJobService.validateVideoCountCronJob();
    }).start();
  }

  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getBusiness(@Payload() payload: JwtAccessPayload) {
    const result = await this.businessService.getAllBusiness(payload.user_id);
    return new ResponseEntity(result);
  }
  @HttpCode(HttpStatus.OK)
  @Get('/current')
  async getUsersBusiness(@Req() req: CustomRequest) {
    if (!req.payload.business_id)
      throw new BadRequestException('business id not found');
    const result = await this.businessService.getBusiness(
      req.payload.business_id,
    );
    return new ResponseEntity(result, 'Your business details');
  }

  @HttpCode(HttpStatus.OK)
  @Get('/influencers')
  async getChannel(@Req() req: CustomRequest) {
    const result = await this.businessService.getChannels(
      req.payload.business_id,
    );
    return new ResponseEntity(result, 'Channels List');
  }

  @HttpCode(HttpStatus.OK)
  @Put('/')
  async UpdateBusiness(
    @Payload() payload: JwtAccessPayload,
    @Body() body: UpdateBusinessDto,
  ) {
    const data = await this.businessService.updateBusiness(
      payload.business_id,
      body,
    );
    return new ResponseEntity(
      data,
      'Business details Updated successfully',
      HttpStatus.OK,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('/report')
  async getBusinessReport(
    @Query() query: GetBusinessReportQueryDto,
    @Payload() payload: JwtAccessPayload,
  ) {
    const data = await this.businessService.getBusinessReport(
      payload.business_id,
      query,
    );
    return new ResponseEntity(
      data,
      'Report Generated for your business',
      HttpStatus.OK,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('/analytics')
  async getBusinessAnalytics(@Payload() payload: JwtAccessPayload) {
    const data = await this.businessService.getBusinessAnalytics(
      payload.business_id,
    );
    return new ResponseEntity(
      data,
      'Analytics for your business',
      HttpStatus.OK,
    );
  }
}
