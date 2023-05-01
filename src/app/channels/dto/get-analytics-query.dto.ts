import { PickType } from '@nestjs/mapped-types';
import { GetVideosQueryDto } from 'src/app/videos/dto/get-videos-query.dto';

export default class GetAnalyticsQueryDto extends PickType(GetVideosQueryDto, [
  'start_date',
  'end_date',
]) {}
