import { Exclude, Expose, Type } from 'class-transformer';
import AuthRegisterResponse from './auth-register-response.dto';
import { ChannelResponse } from 'src/app/channels/dto/channels-response.dto';

@Exclude({ toClassOnly: true })
export default class AuthRegisterChannelResponse extends AuthRegisterResponse {
  @Type(() => ChannelResponse)
  @Expose()
  channel: ChannelResponse;
}
