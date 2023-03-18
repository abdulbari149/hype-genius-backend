import UserEntity from 'src/app/users/entities/user.entity';
import { RoleRepository } from './../app/roles/role.repository';
/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  MethodNotAllowedException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { CacheService } from '../helpers/CacheService';
import { ResponseMessage } from '../common/messages';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtAccessPayload } from 'src/app/auth/auth.interface';
import { InjectRepository } from '@nestjs/typeorm';
import ROLES from 'src/constants/roles';
import BusinessEntity from 'src/app/business/entities/business.entity';
import ChannelEntity from 'src/app/channels/entities/channels.entity';

interface JWTPayloadWithExp extends JwtAccessPayload {
  iat: number;
  exp: number;
}
const { FORBIDDEN } = ResponseMessage;

const method_types = ['GET', 'PUT', 'DELETE', 'PATCH', 'POST'];

const create_dynamic_api_url = (params: Record<any, any>, url: string) => {
  const entries = {};
  for (const [key, value] of Object.entries(params)) {
    if (value in entries) {
      entries[value].push(key);
    } else {
      entries[value] = [key];
    }
  }
  const start_index_of_query = url.indexOf('?');
  const query_params_string =
    start_index_of_query !== -1
      ? url.slice(start_index_of_query, url.length)
      : '';
  const url_parts = url.replace(query_params_string, '').split('/');
  return url_parts
    .map((e) => {
      if (e in entries) {
        const keys: any[] = entries[e];
        return ':' + keys.shift();
      }
      return e;
    })
    .join('/');
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private cacheService: CacheService,
    private roleRepository: RoleRepository,
    private dataSource: DataSource,
    private configService: ConfigService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(BusinessEntity)
    private businessRepository: Repository<BusinessEntity>,
    @InjectRepository(ChannelEntity)
    private channelRepository: Repository<ChannelEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.access.secret'),
      passReqToCallback: true,
    });
  }

  private async getRolePermissions(
    role: string,
  ): Promise<Array<{ request_type: string; end_point: string }>> {
    let permissions = JSON.parse(
      await this.cacheService.getFromCache(`${role}_permissions`),
    );
    if (!permissions) {
      permissions = await this.roleRepository.GetPermissions(role);
    }
    return permissions;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  async validate(req: Request, payload: JWTPayloadWithExp) {
    const { method, params, originalUrl } = req;
    if (!method_types.includes(method)) {
      throw new MethodNotAllowedException(
        `${req.method} on ${originalUrl} isnt allowed`,
      );
    }
    const url = create_dynamic_api_url(params, originalUrl);
    const permissions = await this.getRolePermissions(payload.role);
    if (!permissions.some((p) => p.end_point === url)) {
      throw new ForbiddenException(FORBIDDEN);
    }

    const user = await this.userRepository.findOne({
      where: { id: payload.user_id, roleId: payload.role_id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        email: true,
        roleId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
      loadEagerRelations: false,
      relations: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
