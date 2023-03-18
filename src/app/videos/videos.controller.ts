import { Controller } from '@nestjs/common';

@Controller({
  path: '/videos',
  version: '1',
})
export default class VideosController {}
