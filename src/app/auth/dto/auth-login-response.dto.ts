import { Exclude, Expose } from 'class-transformer';
import AuthMeResponse from './auth-me-response.dto';

@Exclude({ toClassOnly: true })
export default class AuthLoginResponse extends AuthMeResponse {
  @Expose()
  access_token: string;
  @Expose()
  refresh_token: string;
}
