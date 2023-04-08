import { NotesRepository } from './../notes/notes.repository';
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
import { VideosResponseDto } from './dto/videos-response.dto';
import AddNoteDto from './dto/add-note.dto';
import { NotesEntity } from '../notes/entities/notes.entity';
import { VideoNotesEntity } from '../notes/entities/video_notes.entity';
import { NotesResponse } from '../notes/dto/notes-response.dto';
import { JwtAccessPayload } from '../auth/auth.interface';
import { youtube_v3, google } from 'googleapis';
import ContractEntity from '../contract/entities/contract.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { VideoUploadEvent } from './videos.event';
import { AlertsEntity } from '../alerts/entities/alerts.entity';
import { alerts_enum } from 'src/common/enum';
import { BusinessChannelAlertsEntity } from '../alerts/entities/business_channel_alerts.entity';

@Injectable()
export default class VideosService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(VideosEntity)
    private videosRepository: Repository<VideosEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  public async getVideosInfo(links: string[]) {
    const ids = links.map((link: string) => {
      const ytURL = new URL(link);
      return ytURL.searchParams.get('v');
    });
    const data = await google
      .youtube({
        version: 'v3',
        auth: 'AIzaSyABqkxOM2LyiIyo-wg9AuW8js3OIbb_pp4',
      })
      .videos.list({
        id: ids,
        part: ['snippet', 'statistics'],
      });
    return data.data.items.map((item) => {
      return {
        link: 'https://www.youtube.com/watch?v=' + item.id,
        title: item.snippet.title,
        views: item.statistics.viewCount,
      };
    });
  }

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
      const contract = await manager.find(ContractEntity, {
        where: { business_channel_id: businessChannel.id },
      });
      if (!contract) {
        throw new NotFoundException('Contract not found');
      }
      if (video) throw new ConflictException('Video already exists');
      if (!businessChannel)
        throw new NotFoundException(`Not Associated with the business`);
      const videoInfo = await this.getVideosInfo([data.link]);
      const video_entity = plainToInstance(VideosEntity, {
        title: videoInfo[0].title,
        link: data.link,
        views: videoInfo[0].views,
        is_payment_due: true,
        business_channel_id: businessChannel.id,
      });

      const promise1 = query_runner.manager.find(AlertsEntity, {
        where: { name: alerts_enum.PAYMENT_DUE },
      });
      const promise2 = query_runner.manager.find(AlertsEntity, {
        where: { name: alerts_enum.NEW_VIDEO_UPLOAD },
      });
      const alerts = await Promise.all([promise1, promise2]);
      const [payment_due_alert, new_video_upload_alert] = alerts;
  /*
      Yahan bas map lagana hai
      const mapped_business_channel_alert = plainToInstance(
        BusinessChannelAlertsEntity,
        {
          business_channel_id: businessChannel.id,
          alert_id: payment_due_alert.id,
        },
      );
      const business_channel_alert = await query_runner.manager.save(
        BusinessChannelAlertsEntity,
      );
      */
      // TODO:
      // Create both alerts and businessChannelVidoeAlerts;
      // New video uploaded
      // Payment Due
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
    is_payment_due: boolean,
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
    const video_data = await this.videosRepository.find({
      where: { business_channel_id: In(ids), is_payment_due },
      loadEagerRelations: false,
      relations: { payments: true },
    });
    const links = video_data.map((v) => v.link);
    this.eventEmitter.emit('video.views', new VideoUploadEvent({ links }));
    return plainToInstance(VideosResponseDto, video_data);
  }

  public async addNote(
    body: AddNoteDto,
    video_id: number,
    payload: JwtAccessPayload,
  ) {
    const query_runner = this.dataSource.createQueryRunner();
    try {
      await query_runner.startTransaction();
      const businessChannel = await query_runner.manager.findOne(
        BusinessChannelEntity,
        {
          where: {
            channelId: payload.channel_id,
            userId: payload.user_id,
          },
          loadEagerRelations: false,
        },
      );
      if (!businessChannel)
        throw new NotFoundException(
          'The business is not associated with your channel',
        );
      const video = await query_runner.manager.findOne(VideosEntity, {
        where: {
          id: video_id,
          business_channel_id: businessChannel.id,
        },
        loadEagerRelations: true,
      });

      if (!video) throw new NotFoundException('Video doesnt exists');

      const note_entity = plainToInstance(NotesEntity, { body: body.body });
      const note = await query_runner.manager.save(note_entity);
      const video_note_entity = plainToInstance(VideoNotesEntity, {
        video_id: video.id,
        note_id: note.id,
      });
      await query_runner.manager.save(video_note_entity);
      await query_runner.commitTransaction();
      return plainToInstance(NotesResponse, note);
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw error;
    } finally {
      await query_runner.release();
    }
  }

  public async getNotes(video_id: number, payload: JwtAccessPayload) {
    const query = this.dataSource
      .createQueryBuilder()
      .select([
        'n.body as body',
        'n.id as id',
        'n.created_at as "createdAt"',
        'n.updated_at as "updatedAt"',
        'n.deleted_at as "deletedAt"',
      ])
      .from(NotesEntity, 'n')
      .innerJoin('n.video_notes', 'vn')
      .where('vn.video_id=:video_id AND n.deleted_at IS NULL', { video_id })
      .orderBy('n.created_at', 'DESC');
    const data = await query.getRawMany();
    return plainToInstance(NotesResponse, data);
  }
}
