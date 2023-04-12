import { Body, Controller, Post } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRoutesDto } from './dto/create-routes.dto';
import { Public } from 'src/decorators/public.decorator';
import ResponseEntity from 'src/helpers/ResponseEntity';

@Controller({
  path: 'routes',
  version: '1',
})
export class RoutesController {
  constructor(private routesService: RoutesService) {}

  @Public()
  @Post('/')
  async createRoutes(@Body() data: CreateRoutesDto) {
    const res = await this.routesService.Create(data);
    return new ResponseEntity(res, 'Route has been created successfully');
  }
}
