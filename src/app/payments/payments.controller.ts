import { Controller } from '@nestjs/common';

@Controller({
  path: '/payments',
  version: '1',
})
export default class PaymentsController {}
