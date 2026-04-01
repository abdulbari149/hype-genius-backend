import { Expose, Type } from 'class-transformer';
import UserResponse from 'src/app/users/dto/user-response.dto';

export default abstract class AuthRegisterResponse {
  @Type(() => UserResponse)
  @Expose()
  user: UserResponse;

  @Expose()
  access_token: string;
  @Expose()
  refresh_token: string;
}
