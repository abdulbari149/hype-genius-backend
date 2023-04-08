import { Body, Controller, Post } from '@nestjs/common';
import PaymentsService from './payments.service';
import { CreatePaymentsDto } from './dto/create-payments.dto';
import ResponseEntity from 'src/helpers/ResponseEntity';
import { Payload } from 'src/decorators/payload.decorator';
import { JwtAccessPayload } from '../auth/auth.interface';

@Controller({
  path: '/payments',
  version: '1',
})
export default class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('/')
  async CreatePayment(
    @Body() body: CreatePaymentsDto,
    @Payload() payload: JwtAccessPayload,
  ) {
    const data = await this.paymentsService.createPayment(body, payload);
    return new ResponseEntity(data);
  }
}
