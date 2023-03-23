import { ChannelResponse } from './../channels/dto/channels-response.dto';
import { plainToInstance } from 'class-transformer';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import BusinessChannelEntity from 'src/app/business/entities/business.channel.entity';
import BusinessEntity from './entities/business.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBusinessDto } from './dto/create-business.dto';
import { BusinessResponse } from './dto/business-response.dto';

@Injectable()
export default class BusinessService {
  constructor(
    @InjectRepository(BusinessEntity)
    private businessRepository: Repository<BusinessEntity>,
    private dataSource: DataSource,
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

  public async getAllBusiness(userId: number) {
    const data = await this.dataSource
      .getRepository(BusinessChannelEntity)
      .find({
        where: { userId },
        loadEagerRelations: false,
        relations: { business: true },
      });
    return plainToInstance(
      BusinessResponse,
      data.map((item) => item.business),
    );
  }

  public async getChannels(businessId: number) {
    const data = await this.dataSource
      .getRepository(BusinessChannelEntity)
      .createQueryBuilder('bc')
      .select([
        'bc.business_id as business_id',
        'bc.channel_id as channel_id',
        `CONCAT(i.first_name, ' ', i.last_name) as influencer_name`,
      ])
      .innerJoin('bc.channel', 'c')
      .innerJoin('c.user', 'i')
      .where('bc.business_id=:businessId', { businessId })
      .getRawMany();
    return data;
  }

  public async getBusiness(id: number) {
    const business = await this.businessRepository.findOne({
      where: { id },
      loadEagerRelations: false,
    });
    return plainToInstance(BusinessResponse, {
      ...business,
    });
  }
}
