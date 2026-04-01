import { JsonWebTokenError } from 'jsonwebtoken';
import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { MESSAGES } from '../common/messages';
import { IS_PUBLIC } from '../decorators/public.decorator';

const {
  AUTH: {
    ERROR: { TOKEN_EXPIRED, TOKEN_INVALID, TOKEN_INVALID_OR_EXPIRED },
  },
} = MESSAGES;

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (info instanceof JsonWebTokenError) {
      const errorMapper = {
        TokenExpiredError: TOKEN_EXPIRED,
        JsonWebTokenError: TOKEN_INVALID,
        default: TOKEN_INVALID_OR_EXPIRED,
      };
      console.log({ errorMapper });
      throw new UnauthorizedException(
        errorMapper[info.name in errorMapper ? info.name : 'default'],
      );
    }
    return super.handleRequest(err, user, info, context, status);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log({ context, isPublic });
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
