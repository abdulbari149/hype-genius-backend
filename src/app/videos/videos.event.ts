import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import VideosEntity from './entities/videos.entity';
import { google } from 'googleapis';

export class VideoUploadEvent {
  public links: string[];
  constructor({ links }: { links: string[] }) {
    this.links = links;
  }
}

@Injectable()
export class VideoNotificationService {
  constructor(private dataSource: DataSource) {}

  public async getVideosInfo(links: string[]) {
    const ids = links.map((link: string) => {
      const ytURL = new URL(link);
      return ytURL.searchParams.get('v');
    });
    try {
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
    } catch (error) {
      console.log(error);
    }
  }

  @OnEvent('video.views')
  async videoViewsUpdate(payload: VideoUploadEvent) {
    this.getVideosInfo(payload.links)
      .then((data) => {
        // TODO: update views for a video in database
        const videoRepository = this.dataSource.getRepository(VideosEntity);
        return Promise.all(
          data.map(async (item) => {
            await videoRepository.update(
              { link: item.link },
              { views: parseInt(item.views, 10) },
            );
          }),
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
