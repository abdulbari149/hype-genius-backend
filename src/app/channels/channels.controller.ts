import { Controller, Post, Put, Body, Get, HttpStatus } from '@nestjs/common';
import { Payload } from 'src/decorators/payload.decorator';
import { JwtAccessPayload } from '../auth/auth.interface';
import ChannelService from './channels.service';
import ResponseEntity from 'src/helpers/ResponseEntity';
import { UpdateOnboardingDto } from './dto/update-onboarding.dto';

@Controller({
  path: '/channels',
  version: '1',
})
export default class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Post('/influencer/onboarding')
  async createInfluencerOnboarding(@Payload() payload: JwtAccessPayload) {
    const data = await this.channelService.createOnboarding(
      payload.business_id,
    );
    return new ResponseEntity(
      data,
      'Onboarding created successfully',
      HttpStatus.CREATED,
    );
  }

  @Put('/influencer/onboarding')
  async updateInfluencerOnboarding(@Body() data: UpdateOnboardingDto) {
    const result = await this.channelService.updateOnboarding(data);
    return new ResponseEntity(result);
  }

  @Get('/analytics')
  async getChannelAnalytics(@Payload() payload: JwtAccessPayload) {
    const result = await this.channelService.getChannelAnalytics(payload);
    console.log(result);
    return new ResponseEntity(result);
  }
}
