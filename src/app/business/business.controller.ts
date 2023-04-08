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
  Put,
  Req,
} from '@nestjs/common';
import BusinessService from './business.service';
import ResponseEntity from 'src/helpers/ResponseEntity';
import { Payload } from 'src/decorators/payload.decorator';
import { UpdateBusinessDto } from './dto/update-business.dto';

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
  @Get('/influencers')
  async getChannel(@Req() req: CustomRequest) {
    const result = await this.businessService.getChannels(
      req.payload.business_id,
    );
    return new ResponseEntity(result, 'Channels List');
  }

  @HttpCode(HttpStatus.CREATED)
  @Put('/:business_id')
  async UpdateBusiness(
    @Param('business_id') business_id: number,
    @Body() body: UpdateBusinessDto,
  ) {
    const data = await this.businessService.updateBusiness(business_id, body);
    return new ResponseEntity(data);
  }
}
