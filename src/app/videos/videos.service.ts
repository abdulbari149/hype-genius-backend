import { JwtAccessPayload } from './../../../dist/auth.interface.d';
import { plainToInstance } from 'class-transformer';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DataSource, In } from 'typeorm';
import VideosEntity from './entities/videos.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import BusinessChannelEntity from '../business/entities/business.channel.entity';
import BusinessEntity from 'src/app/business/entities/business.entity';
import ChannelEntity from 'src/app/channels/entities/channels.entity';
import { VideosResponseDto } from './dto/videos-response.dto';
@Injectable()
export default class VideosService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(VideosEntity)
    private videosRepository: Repository<VideosEntity>,
  ) {}

  public async createVideo(data: CreateVideoDto, channelId: number) {
    const query_runner = this.dataSource.createQueryRunner();
    try {
      await query_runner.startTransaction();

      const manager = query_runner.manager;

      const [video, businessChannel] = await Promise.all([
        manager.findOne(VideosEntity, {
          where: { link: data.link },
          loadEagerRelations: false,
        }),
        manager.findOne(BusinessChannelEntity, {
          where: { businessId: data.businessId, channelId: channelId },
          loadEagerRelations: false,
          relations: { business: true, channel: true },
        }),
      ]);

      if (video) throw new ConflictException('Video already exists');
      if (!businessChannel)
        throw new NotFoundException(`Not Associated with the business`);

      const video_entity = plainToInstance(VideosEntity, {
        title: data.title,
        link: data.link,
        views: 0,
        is_payment_due: true,
        business_channel_id: businessChannel.id,
      });
      const video_data = await manager.save(video_entity);
      await query_runner.commitTransaction();
      return plainToInstance(VideosResponseDto, video_data);
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw error;
    } finally {
      await query_runner.release();
    }
  }

  public async getVideos(
    business_channel_id: number | null,
    payload: JwtAccessPayload,
  ) {
    const ids: number[] = [];
    if (business_channel_id === null) {
      const businessChannels = await this.dataSource
        .getRepository(BusinessChannelEntity)
        .find({
          where: { channelId: payload.channel_id, userId: payload.user_id },
          select: { id: true },
          loadEagerRelations: false,
        });
      ids.push(...businessChannels.map((bc) => bc.id));
    } else {
      ids.push(business_channel_id);
    }
    const video_data = this.videosRepository.find({
      where: { business_channel_id: In(ids) },
      loadEagerRelations: false,
      relations: { payments: true },
    });
    return plainToInstance(VideosResponseDto, video_data);
  }
}
