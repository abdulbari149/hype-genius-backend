import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import BusinessEntity from './entities/business.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export default class BusinessService {
  constructor(
    @InjectRepository(BusinessEntity)
    private businessRepository: Repository<BusinessEntity>,
  ) {}
}
