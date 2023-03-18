import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import VideosEntity from './entities/videos.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export default class VideosService {
  constructor(
    @InjectRepository(VideosEntity)
    private videosRepository: Repository<VideosEntity>,
  ) {}
}
