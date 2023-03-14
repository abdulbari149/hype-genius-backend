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
    const user = await this.userRepository.findOne({
      where: { email: data.email },
      relations: { role: true },
    });
    if (!user) {
      throw new NotFoundException(USER_NOT_EXIST);
    }
    if (!(await Comparepassword(data.password, user.password))) {
      throw new NotAcceptableException(EMAIL_PASSWORD_INCORRECT);
    }
    delete user['password'];
    const payload = {
      user_id: user.id,
      role: user.role.role,
      role_id: user.roleId,
    };
    const access_promise = this.jwtHelperService.SignAccessToken(payload);
    const refresh_promise = this.jwtHelperService.SignRefreshToken(payload);
    const [access_token, refresh_token] = await Promise.all([
      access_promise,
      refresh_promise,
    ]);
    return { user: user, access_token, refresh_token };
  }
}
