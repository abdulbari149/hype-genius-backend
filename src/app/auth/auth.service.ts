import BusinessChannelEntity from 'src/app/business/entities/business.channel.entity';
import ChannelEntity from 'src/app/channels/entities/channels.entity';
import { RoleEntity } from 'src/app/roles/entities/role.entity';
import { Repository, DataSource } from 'typeorm';
import UserEntity from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { Comparepassword } from 'src/helpers/UtilHelper';
import { MESSAGES } from '../../common/messages';
import { JwtHelperService } from 'src/helpers/jwt-helper.service';
import AuthRegisterBusinessDto from './dto/auth-register-business.dto';
import { hash } from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import BusinessEntity from '../business/entities/business.entity';
import ROLES from 'src/constants/roles';
import AuthRegisterChannelDto from './dto/auth-register-channel.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

const {
  USER: {
    ERROR: { USER_NOT_EXIST },
  },
  AUTH: {
    ERROR: {},
  },
} = MESSAGES;
@Injectable()
export default class AuthService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtHelperService: JwtHelperService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  public async validateToken(token: string, secret: string) {
    const payload = await this.jwtService.verifyAsync(token, { secret });
    return payload;
  }

  async login(data: AuthEmailLoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: data.email },
      loadEagerRelations: false,
      relations: { role: true },
    });
    if (!user) {
      throw new NotFoundException(USER_NOT_EXIST);
    }
    if (!(await Comparepassword(data.password, user.password))) {
      throw new NotAcceptableException('Password Incorrect');
    }

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

  public async RegisterBusiness(data: AuthRegisterBusinessDto) {
    const query_runner = this.dataSource.createQueryRunner();
    try {
      await query_runner.startTransaction();
      const onboardingLink = `${this.configService.get(
        'app.backendDomain',
      )}/${data.businessName.replace(' ', '').trim()}`;
      const [user, role, password, business] = await Promise.all([
        query_runner.manager.findOne(UserEntity, {
          where: { email: data.email },
          loadEagerRelations: false,
        }),
        query_runner.manager.findOne(RoleEntity, {
          where: { role: ROLES.BUSINESS_ADMIN },
          loadEagerRelations: false,
        }),
        hash(data.password, 10),
        query_runner.manager.findOne(BusinessEntity, {
          where: [{ name: data.businessName }, { onboardingLink }],
        }),
      ]);
      if (user) throw new ConflictException('User already exists');
      if (business) throw new ConflictException('business already exists');

      const user_entity = plainToInstance(UserEntity, {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        roleId: role.id,
        password,
      });
      const user_data = await query_runner.manager.save(user_entity);
      const business_entity = plainToInstance(BusinessEntity, {
        name: data.businessName,
        link: data.businessLink,
        adminId: user_data.id,
        onboardingLink,
      });
      const business_data = await query_runner.manager.save(business_entity);
      await query_runner.commitTransaction();
      const payload = {
        user_id: user.id,
        role: user.role.role,
        role_id: user.roleId,
        business_id: business_data.id,
      };
      const access_promise = this.jwtHelperService.SignAccessToken(payload);
      const refresh_promise = this.jwtHelperService.SignRefreshToken(payload);
      const [access_token, refresh_token] = await Promise.all([
        access_promise,
        refresh_promise,
      ]);
      return {
        ...user_data,
        password: undefined,
        business: business_data,
        token: { access_token, refresh_token },
      };
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw error;
    } finally {
      await query_runner.release();
    }
  }

  public async RegisterChannel(
    data: AuthRegisterChannelDto,
    businessId: number,
  ) {
    const query_runner = this.dataSource.createQueryRunner();
    try {
      await query_runner.startTransaction();
      const [user, role, password, channel, business] = await Promise.all([
        query_runner.manager.findOne(UserEntity, {
          where: { email: data.email },
          loadEagerRelations: false,
        }),
        query_runner.manager.findOne(RoleEntity, {
          where: { role: ROLES.INFLUENCER },
          loadEagerRelations: false,
        }),
        hash(data.password, 10),
        query_runner.manager.findOne(ChannelEntity, {
          where: { name: data.channelName },
        }),
        query_runner.manager.findOne(BusinessEntity, {
          where: { id: businessId },
        }),
      ]);

      if (user) {
        throw new ConflictException('User already exists');
      }
      if (!business) {
        throw new NotFoundException('business not found');
      }
      if (channel) {
        throw new ConflictException('channel already exists');
      }

      const user_entity = plainToInstance(UserEntity, {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        roleId: role.id,
        password,
      });
      const user_data = await query_runner.manager.save(user_entity);
      const channel_entity = plainToInstance(ChannelEntity, {
        name: data.channelName,
        link: data.channelLink,
        influencerId: user_data.id,
      });
      const channel_data = await query_runner.manager.save(channel_entity);
      const business_channel_entity = plainToInstance(BusinessChannelEntity, {
        businessId: business.id,
        channelId: channel_data.id,
        userId: user_data.id,
      });
      await query_runner.manager.save(business_channel_entity);
      await query_runner.commitTransaction();
      return {
        ...user_data,
        password: undefined,
        channel: channel_data,
      };
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw error;
    } finally {
      await query_runner.release();
    }
  }
}
