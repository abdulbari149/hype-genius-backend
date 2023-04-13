import ContractEntity from 'src/app/contract/entities/contract.entity';
import BusinessChannelEntity from 'src/app/business/entities/business.channel.entity';
import ChannelEntity from 'src/app/channels/entities/channels.entity';
import { RoleEntity } from 'src/app/roles/entities/role.entity';
import { Repository, DataSource, EntityManager } from 'typeorm';
import UserEntity from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
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
import AuthLoginResponse from './dto/auth-login-response.dto';
import AuthRegisterBusinessResponse from './dto/auth-register-business-response.dto';
import CreateUserDto from '../users/dto/create-user.dto';
import { JwtAccessPayload } from './auth.interface';
import AuthRegisterChannelResponse from './dto/auth-register-channel.response.dto';
import { AlertsEntity } from '../alerts/entities/alerts.entity';
import { Alerts } from 'src/constants/alerts';
import { BusinessChannelAlertsEntity } from '../alerts/entities/business_channel_alerts.entity';
import OnboardRequestsEntity, {
  OnboardRequestsData,
} from '../channels/entities/onboard_requests.entity';
import { NotesEntity } from '../notes/entities/notes.entity';
import { BusinessChannelNotesEntity } from '../notes/entities/business_channel_notes.entity';

const {
  USER: {
    ERROR: { USER_NOT_EXIST },
  },
  AUTH: {
    ERROR: {},
  },
} = MESSAGES;

type OnboardingTokenPayload = {
  userId?: number;
  businessId?: number;
  onboardingId?: number;
};

@Injectable()
export default class AuthService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(BusinessEntity)
    private businessRepository: Repository<BusinessEntity>,
    @InjectRepository(ChannelEntity)
    private channelRepository: Repository<ChannelEntity>,
    private jwtHelperService: JwtHelperService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  public async validateToken<T>(token: string, secret: string): Promise<T> {
    const payload = await this.jwtService.verifyAsync(token, { secret });
    return payload;
  }

  public async generateTokens<T extends JwtAccessPayload>(payload: T) {
    const access_promise = this.jwtHelperService.SignAccessToken(payload);
    const refresh_promise = this.jwtHelperService.SignRefreshToken(payload);
    const [access_token, refresh_token] = await Promise.all([
      access_promise,
      refresh_promise,
    ]);
    return { access_token, refresh_token };
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

    if (user.role.role === ROLES.BUSINESS_ADMIN) {
      const business = await this.businessRepository.findOne({
        where: { admin_id: payload.user_id },
        loadEagerRelations: false,
      });
      Object.assign(payload, { business_id: business.id });
    } else if (user.role.role === ROLES.INFLUENCER) {
      const channel = await this.channelRepository.findOne({
        where: { influencer_id: payload.user_id },
        loadEagerRelations: false,
      });
      Object.assign(payload, { channel_id: channel.id });
    }

    const { access_token, refresh_token } = await this.generateTokens(payload);
    return plainToInstance(AuthLoginResponse, {
      user: {
        ...user,
        role: user.role.role,
      },
      access_token,
      refresh_token,
    });
  }

  private async createUser(
    data: CreateUserDto & { role: ROLES },
    manager: EntityManager,
  ) {
    const [user, role, password] = await Promise.all([
      manager.findOne(UserEntity, {
        where: { email: data.email },
        loadEagerRelations: false,
        relations: { role: true },
      }),
      manager.findOne(RoleEntity, {
        where: { role: data.role },
        loadEagerRelations: false,
      }),
      hash(data.password, 10),
    ]);
    if (user) {
      return {
        error: new ConflictException('User already exists'),
        data: { user, role },
      };
    }
    const user_entity = plainToInstance(UserEntity, {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      roleId: role.id,
      password,
    });
    const user_data = await manager.save(user_entity);
    return { data: { user: user_data, role }, error: null };
  }

  public async registerBusiness(data: AuthRegisterBusinessDto) {
    const query_runner = this.dataSource.createQueryRunner();
    try {
      await query_runner.startTransaction();
      const onboardingLink = `${this.configService.get(
        'app.backendDomain',
      )}/${data.businessName.replace(' ', '').trim()}`;
      const {
        data: { user, role },
        error,
      } = await this.createUser(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          password: data.password,
          role: ROLES.BUSINESS_ADMIN,
        },
        query_runner.manager,
      );
      if (error) throw error;

      const business = await query_runner.manager.findOne(BusinessEntity, {
        where: [{ name: data.businessName }, { onboardingLink }],
      });

      if (business) throw new ConflictException('business already exists');

      const business_entity = plainToInstance(BusinessEntity, {
        name: data.businessName,
        link: data.businessLink,
        admin_id: user.id,
        onboardingLink,
      });
      const business_data = await query_runner.manager.save(business_entity);
      const payload = {
        user_id: user.id,
        role: role.role,
        role_id: user.roleId,
        business_id: business_data.id,
      };
      const { access_token, refresh_token } = await this.generateTokens(
        payload,
      );
      await query_runner.commitTransaction();
      return plainToInstance(AuthRegisterBusinessResponse, {
        user: {
          ...user,
          role: role.role,
        },
        business: business_data,
        access_token,
        refresh_token,
      });
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw error;
    } finally {
      await query_runner.release();
    }
  }

  private validatOnboardingData(data: OnboardRequestsData) {
    const fields = [
      'amount',
      'currency_id',
      'is_one_time',
      'upload_frequency',
    ] as const;

    if (!data || !data.contract)
      throw new NotFoundException(
        'Onboard URL may be expired or changed. Please request a new onboarding url',
      );

    if (!fields.every((key) => Object.keys(data.contract).includes(key))) {
      throw new BadRequestException(
        'Onboard URL has some malformed data. Please request a new onboarding url',
      );
    }
  }

  private async onboardChannel(
    manager: EntityManager,
    onboarding_id: number,
    business_channel_id: number,
  ) {
    const onboarding = await manager.findOne(OnboardRequestsEntity, {
      where: { id: onboarding_id },
      loadEagerRelations: false,
    });
    this.validatOnboardingData(onboarding.data);
    const { note = '', ...contract_data } = onboarding.data.contract;
    Object.assign(contract_data, { business_channel_id });
    const contract_entity = plainToInstance(ContractEntity, contract_data);
    await manager.save(contract_entity);
    if (note === '') return;
    const note_entity = plainToInstance(NotesEntity, { body: note });
    const saved_note = await manager.save(note_entity);
    const business_channel_note_entity = plainToInstance(
      BusinessChannelNotesEntity,
      { business_channel_id, note_id: saved_note.id },
    );
    await manager.save(business_channel_note_entity);
  }

  public async validateSecondOnboardingToken(token: string) {
    const payload: OnboardingTokenPayload = await this.validateToken(
      token,
      this.configService.get('jwt.onboarding_second.secret'),
    );
    if (payload?.businessId === undefined || payload?.userId === undefined) {
      throw new ForbiddenException('Malformed Token');
    }
    return payload;
  }

  public async onboardNewPartner(payload: OnboardingTokenPayload) {
    const query_runner = this.dataSource.createQueryRunner();
    await query_runner.connect();
    await query_runner.startTransaction();
    try {
      const [user, business, channel, missingDealAlert] = await Promise.all([
        query_runner.manager.findOne(UserEntity, {
          where: { id: payload.userId },
          loadEagerRelations: false,
          relations: { role: true },
        }),
        query_runner.manager.findOne(BusinessEntity, {
          where: { id: payload.businessId },
          loadEagerRelations: false,
        }),
        query_runner.manager.findOne(ChannelEntity, {
          where: { influencer_id: payload.userId },
          loadEagerRelations: false,
        }),
        query_runner.manager.findOne(AlertsEntity, {
          where: { name: Alerts.MISSING_DEAL },
          loadEagerRelations: false,
        }),
      ]);

      if (!business) {
        throw new NotFoundException('business not found');
      }
      if (!channel) {
        throw new NotFoundException('Channel not found');
      }
      const business_channel_entity = plainToInstance(BusinessChannelEntity, {
        businessId: business.id,
        channelId: channel.id,
        userId: channel.influencer_id,
      });
      const businessChannel = await query_runner.manager.save(
        business_channel_entity,
      );
      if (!payload?.onboardingId) {
        const alert = plainToInstance(BusinessChannelAlertsEntity, {
          alert_id: missingDealAlert.id,
          business_channel_id: businessChannel.id,
        });
        await query_runner.manager.save(alert);
      } else {
        await this.onboardChannel(
          query_runner.manager,
          payload.onboardingId,
          businessChannel.id,
        );
      }
      const { access_token, refresh_token } = await this.generateTokens({
        user_id: user.id,
        role_id: user.roleId,
        role: user.role.role,
        channel_id: channel.id,
      });

      await query_runner.commitTransaction();
      const response = plainToInstance(AuthRegisterChannelResponse, {
        user,
        channel,
        access_token,
        refresh_token,
      });
      return response;
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw error;
    } finally {
      await query_runner.release();
    }
  }

  public async registerChannel(
    data: AuthRegisterChannelDto,
    payload: { businessId: number; onboardingId: number },
  ) {
    const query_runner = this.dataSource.createQueryRunner();
    try {
      await query_runner.startTransaction();
      const {
        data: { user, role },
        error,
      } = await this.createUser(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          password: data.password,
          role: ROLES.INFLUENCER,
        },
        query_runner.manager,
      );
      if (error) {
        const isUserException = error instanceof ConflictException;
        if (!isUserException) throw error;
        const userInBusiness = await query_runner.manager.findOne(
          BusinessChannelEntity,
          {
            where: { businessId: payload.businessId, userId: user.id },
          },
        );

        if (user.role.role !== role.role) {
          throw new ForbiddenException(
            'This email address has been taken by another user with a business account',
          );
        }
        if (userInBusiness) {
          const url = `${this.configService.get(
            'app.frontendDomain',
          )}/auth/login`;
          await query_runner.commitTransaction();
          return {
            isRedirect: true,
            data: {
              url,
            },
            message:
              'You are already part of this business. Please login to your account',
          };
        }
        const newPayload: {
          userId: number;
          businessId: number;
          onboardingId?: number;
        } = {
          userId: user.id,
          businessId: payload.businessId,
        };

        if (payload.onboardingId) {
          newPayload.onboardingId = payload.onboardingId;
        }
        const token = this.jwtService.sign(newPayload, {
          secret: this.configService.get('jwt.onboarding_second.secret'),
          expiresIn: this.configService.get('jwt.onboarding_second.expiresIn'),
        });
        const url = `${this.configService.get(
          'app.frontendDomain',
        )}/auth/signup/onboard?token=${token}`;
        await query_runner.commitTransaction();
        return {
          data: {
            url,
          },
          message:
            'You are already part of business, Please Join the new buisness',
          isRedirect: true,
        };
      }

      const [channel, business, missingDealAlert] = await Promise.all([
        query_runner.manager.findOne(ChannelEntity, {
          where: { name: data.channelName },
          loadEagerRelations: false,
        }),
        query_runner.manager.findOne(BusinessEntity, {
          where: { id: payload.businessId },
          loadEagerRelations: false,
        }),
        query_runner.manager.findOne(AlertsEntity, {
          where: { name: Alerts.MISSING_DEAL },
          loadEagerRelations: false,
        }),
      ]);
      if (!business) {
        throw new NotFoundException('business not found');
      }
      if (channel) {
        throw new ConflictException('channel already exists');
      }
      const channel_entity = plainToInstance(ChannelEntity, {
        name: data.channelName,
        link: data.channelLink,
        influencer_id: user.id,
      });
      const channel_data = await query_runner.manager.save(channel_entity);
      const business_channel_entity = plainToInstance(BusinessChannelEntity, {
        businessId: business.id,
        channelId: channel_data.id,
        userId: user.id,
      });
      const businessChannel = await query_runner.manager.save(
        business_channel_entity,
      );

      if (!payload?.onboardingId) {
        const alert = plainToInstance(BusinessChannelAlertsEntity, {
          alert_id: missingDealAlert.id,
          business_channel_id: businessChannel.id,
        });
        await query_runner.manager.save(alert);
      } else {
        await this.onboardChannel(
          query_runner.manager,
          payload.onboardingId,
          businessChannel.id,
        );
      }
      const { access_token, refresh_token } = await this.generateTokens({
        user_id: user.id,
        role_id: user.roleId,
        role: role.role,
        channel_id: channel_data.id,
      });

      await query_runner.commitTransaction();
      const response = plainToInstance(AuthRegisterChannelResponse, {
        user,
        channel: channel_data,
        access_token,
        refresh_token,
      });
      return {
        data: response,
        isRedirect: false,
        message: 'Influencer Registered successfully',
      };
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw error;
    } finally {
      await query_runner.release();
    }
  }

  public async RefreshToken(token: string) {
    const payload = await this.jwtHelperService.ValidateRefreshToken(token);
    const access_token = await this.jwtHelperService.SignAccessToken({
      role: payload.role,
      role_id: payload.role_id,
      user_id: payload.user_id,
      business_id: payload?.business_id ?? undefined,
      channel_id: payload?.channel_id ?? undefined,
    });
    return access_token;
  }
}
