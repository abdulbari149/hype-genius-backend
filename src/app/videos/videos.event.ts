import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import VideosEntity from './entities/videos.entity';
import { youtube_v3, google } from 'googleapis';
import VideosService from './videos.service';

export class VideoUploadEvent {
  public links: string[];
  constructor({ links }: { links: string[] }) {
    this.links = links;
  }
}

@Injectable()
export class VideoNotificationService {
  constructor(private dataSource: DataSource, private videoService: VideosService) {}
  @OnEvent('video.views')
  async videoViewsUpdate(payload: VideoUploadEvent) {
    this.videoService.getVideosInfo(payload.links).then((data) => {
      // TODO: update views for a video in database

    });
  }
}
