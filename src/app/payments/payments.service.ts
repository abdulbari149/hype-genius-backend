import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import PaymentsEntity from './entities/payments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePaymentsDto } from './dto/create-payments.dto';
import { JwtAccessPayload } from '../auth/auth.interface';
import { plainToInstance } from 'class-transformer';
import BusinessChannelEntity from '../business/entities/business.channel.entity';
import VideosEntity from '../videos/entities/videos.entity';
import BusinessChannelAlertVideoEntity from '../videos/entities/business_channel_video_alert.entity';
import { BusinessChannelAlertsEntity } from '../alerts/entities/business_channel_alerts.entity';

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
        { payment_id: payment.id, is_payment_due: false },
      );

      const business_channel_video_alerts = await query_runner.manager.find(
        BusinessChannelAlertVideoEntity,
        {
          where: { video_id },
          loadEagerRelations: false,
        },
      );

      if (business_channel_video_alerts.length > 0) {
        const business_channel_alert_ids = business_channel_video_alerts.map(
          (bcva) => bcva.business_channel_alert_id,
        );
        await Promise.all([
          query_runner.manager.softDelete(BusinessChannelAlertsEntity, {
            id: In(business_channel_alert_ids),
          }),
          query_runner.manager.softDelete(BusinessChannelAlertVideoEntity, {
            business_channel_alert_id: In(business_channel_alert_ids),
            video_id,
          }),
        ]);
      }
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
