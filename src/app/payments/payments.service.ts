import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import PaymentsEntity from './entities/payments.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export default class PaymentsService {
  constructor(
    @InjectRepository(PaymentsEntity)
    private tagsRepository: Repository<PaymentsEntity>,
  ) {}

  // TODO: create payment
}
