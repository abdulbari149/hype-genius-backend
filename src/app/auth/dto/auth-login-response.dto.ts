import { Exclude, Expose, Type } from 'class-transformer';
import UserResponse from 'src/app/users/dto/user-response.dto';
import AuthMeResponse from './auth-me-response.dto';

@Exclude({ toClassOnly: true })
export default class AuthLoginResponse extends AuthMeResponse {
  @Expose()
  access_token: string;
  @Expose()
  refresh_token: string;
}
