import { JwtAccessPayload } from '../auth/auth.interface';
import { CustomRequest } from './../../types/index';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import BusinessService from './business.service';
import ResponseEntity from 'src/helpers/ResponseEntity';
import { Payload } from 'src/decorators/payload.decorator';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { GetBusinessReportQueryDto } from './dto/get-business-report-query.dto';
import { GetMetricsQueryDto } from './dto/get-metrics-query.dto';
import CreateFollowUpDto from './dto/create-followup.dto';
import { GetChartsDataQueryDto } from './dto/get-charts-query.dto';

@Controller({
  path: '/business',
  version: '1',
})
export default class BusinessController {
  constructor(private businessService: BusinessService) {}

  // TODO: for super admin returns all business
  // TODO: for business admin return his business
  // TODO: for influencer return influencers businesses;
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

  @HttpCode(HttpStatus.OK)
  @Get('/metrics/:business_channel_id')
  async getMetrics(
    @Payload() payload: JwtAccessPayload,
    @Param('business_channel_id') business_channel_id: number,
    @Query() query: GetMetricsQueryDto,
  ) {
    const data = await this.businessService.getMetrics(
      business_channel_id,
      payload,
      query,
    );
    return new ResponseEntity(
      data,
      `Metrics for your business channel id ${business_channel_id}`,
      HttpStatus.OK,
    );
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/followup')
  async createFollowUp(
    @Body() body: CreateFollowUpDto,
    @Payload() payload: JwtAccessPayload,
  ) {
    const result = await this.businessService.createFollowUp(body, payload);
    return new ResponseEntity(
      result,
      'Followup created successfully',
      HttpStatus.CREATED,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('/chart')
  async getChartData(
    @Query() query: GetChartsDataQueryDto,
    @Payload() payload: JwtAccessPayload,
  ) {
    const data = await this.businessService.getChartData(payload, query);
    return new ResponseEntity(data, 'Charts data', HttpStatus.OK);
  }
}
