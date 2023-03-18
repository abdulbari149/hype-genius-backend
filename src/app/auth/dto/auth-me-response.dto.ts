import { Expose, Type } from 'class-transformer';
import UserResponse from 'src/app/users/dto/user-response.dto';

export default class AuthMeResponse {
  @Type(() => UserResponse)
  @Expose()
  user: UserResponse;
}
