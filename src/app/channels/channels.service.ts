import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import ChannelEntity from './entities/channels.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export default class ChannelService {
  constructor(
    @InjectRepository(ChannelEntity)
    private channelRepository: Repository<ChannelEntity>,
  ) {}
}
