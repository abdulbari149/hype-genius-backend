import { Exclude, Expose, Type } from 'class-transformer';
import { BusinessResponse } from 'src/app/business/dto/business-response.dto';
import UserResponse from 'src/app/users/dto/user-response.dto';
import AuthRegisterResponse from './auth-register-response.dto';

@Exclude({ toClassOnly: true })
export default class AuthRegisterBusinessResponse extends AuthRegisterResponse {
  @Type(() => BusinessResponse)
  @Expose()
  business: BusinessResponse;
}
