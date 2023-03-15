import { plainToInstance } from 'class-transformer';
import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import BusinessEntity from './entities/business.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBusinessDto } from './dto/create-business.dto';

@Injectable()
export default class BusinessService {
  constructor(
    @InjectRepository(BusinessEntity)
    private businessRepository: Repository<BusinessEntity>,
  ) {}

  public async createBusiness(data: CreateBusinessDto, adminId: number) {
    const businessExists = await this.businessRepository.findOne({
      where: { name: data.name },
    });
    if (!businessExists) {
      throw new ConflictException('Business already exists');
    }
    const business = plainToInstance(BusinessEntity, { ...data, adminId });
    return await this.businessRepository.save(business);
  }
}
