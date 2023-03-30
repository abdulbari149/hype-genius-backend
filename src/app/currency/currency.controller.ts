import { Controller, Get } from '@nestjs/common';
import CurrencyService from './curreny.service';
import ResponseEntity from 'src/helpers/ResponseEntity';
import { Public } from 'src/decorators/public.decorator';

@Controller({
  version: '1',
  path: '/currency',
})
export default class CurrencyController {
  constructor(private currencyService: CurrencyService) {}

  @Public()
  @Get('/')
  async getCurrencyList() {
    const data = await this.currencyService.getAll();
    return new ResponseEntity(data);
  }
}
