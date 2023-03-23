import { JwtAccessPayload } from './../../../dist/auth.interface.d';
import { CustomRequest } from './../../types/index';
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
} from '@nestjs/common';
import BusinessService from './business.service';
import ResponseEntity from 'src/helpers/ResponseEntity';
import { Payload } from 'src/decorators/payload.decorator';

@Controller({
  path: '/business',
  version: '1',
})
export default class BusinessController {
  constructor(private businessService: BusinessService) {}

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
  @Get('/channel')
  async getChannel(@Req() req: CustomRequest) {
    const result = await this.businessService.getChannels(
      req.payload.business_id,
    );
    return new ResponseEntity(result, 'Channels List');
  }
}
