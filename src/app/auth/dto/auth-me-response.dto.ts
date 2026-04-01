import { Expose, Type } from 'class-transformer';
import UserResponse from '../../users/dto/user-response.dto';

export default class AuthMeResponse {
  @Type(() => UserResponse)
  @Expose()
  user: UserResponse;
}
