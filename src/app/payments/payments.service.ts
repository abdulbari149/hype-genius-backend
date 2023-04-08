import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import PaymentsEntity from './entities/payments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePaymentsDto } from './dto/create-payments.dto';
import { JwtAccessPayload } from '../auth/auth.interface';
import { plainToInstance } from 'class-transformer';
import BusinessChannelEntity from '../business/entities/business.channel.entity';
import VideosEntity from '../videos/entities/videos.entity';

@Injectable()
export default class PaymentsService {
  constructor(
    @InjectRepository(PaymentsEntity)
    private paymentRepository: Repository<PaymentsEntity>,
    private dataSource: DataSource,
  ) {}
  public async createPayment(
    data: CreatePaymentsDto,
    payload: JwtAccessPayload,
  ) {
    const { video_id, ...body } = data;
    const query_runner = this.dataSource.createQueryRunner();
    await query_runner.startTransaction();
    try {
      const business_channels = await query_runner.manager.find(
        BusinessChannelEntity,
        {
          where: {
            id: body.business_channel_id,
            channelId: payload.channel_id,
            businessId: payload.business_id,
          },
        },
      );
      if (!business_channels) {
        throw new ConflictException('You are not affiliated with this channel');
      }
      const mapped_payment = plainToInstance(PaymentsEntity, body);
      const payment = await query_runner.manager.save(mapped_payment);

      await query_runner.manager.update(
        VideosEntity,
        { id: video_id },
        { payment_id: payment.id },
      );
      await query_runner.commitTransaction();
      return payment;
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw error;
    } finally {
      await query_runner.release();
    }
  }
}
