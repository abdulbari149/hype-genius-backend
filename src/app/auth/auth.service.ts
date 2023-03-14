import { Repository } from 'typeorm';
import UserEntity from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { Comparepassword } from 'src/helpers/UtilHelper';
import { MESSAGES } from '../../common/messages';
import { JwtHelperService } from 'src/helpers/jwt-helper.service';
const {
  USER: {
    ERROR: { USER_NOT_EXIST },
  },
  AUTH: {
    ERROR: { EMAIL_PASSWORD_INCORRECT },
  },
} = MESSAGES;
@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtHelperService: JwtHelperService,
  ) {}

  public async Login(data: AuthEmailLoginDto) {
    try {
      const users: any = await this.userRepository.findOne({
        where: { email: data.email },
      });
      if (!users) {
        throw new NotFoundException(USER_NOT_EXIST);
      }

      const password_is_valid = await Comparepassword(
        data.password,
        users.password,
      );
      if (!password_is_valid) {
        throw new NotAcceptableException(EMAIL_PASSWORD_INCORRECT);
      }
      delete users['password'];
      const payload = {
        user_id: users.id,
        roles: users.role,
        role_id: users.roleId,
      };
      const access_promise = this.jwtHelperService.SignAccessToken(payload);
      const refresh_promise = this.jwtHelperService.SignRefreshToken(payload);
      const [access_token, refresh_token] = await Promise.all([
        access_promise,
        refresh_promise,
      ]);
      return { user: users, access_token, refresh_token };
    } catch (error) {
      throw error;
    }
  }
}
