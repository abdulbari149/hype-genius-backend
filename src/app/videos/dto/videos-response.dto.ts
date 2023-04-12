import {
  Exclude,
  Expose,
  Transform,
  Type,
  plainToInstance,
} from 'class-transformer';
import BusinessChannelEntity from 'src/app/business/entities/business.channel.entity';
import { PaymentsResponseDto } from 'src/app/payments/dto/payments-response.dto';
import PaymentsEntity from 'src/app/payments/entities/payments.entity';
import UserResponse from 'src/app/users/dto/user-response.dto';

@Exclude()
export class VideosResponseDto {
  @Expose()
  @Type(() => Number)
  id: number;
  @Expose()
  link: string;
  @Expose()
  title: string;
  @Expose()
  views: number;
  @Expose()
  is_payment_due: boolean;
  @Expose()
  payment_id: number;
  @Expose()
  @Transform((option) => {
    if (typeof option.obj.payments === 'undefined') return;
    if (option.obj.payments instanceof PaymentsEntity) {
      return plainToInstance(PaymentsResponseDto, option.obj.payments);
    }
  })
  payment: PaymentsResponseDto | null;

  @Transform((option) => {
    if (typeof option.obj.business_channels === 'undefined') return;
    if (option.obj.business_channels instanceof BusinessChannelEntity) {
      return plainToInstance(UserResponse, option.obj.business_channels.user);
    }
  })
  @Expose()
  influencer: UserResponse;
  @Expose()
  business_channel_id: number;
  @Expose()
  createdAt: Date | null;
  @Expose()
  updatedAt: Date | null;
  @Expose()
  deletedAt: Date | null;
}
