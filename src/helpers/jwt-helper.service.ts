import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ResponseMessage } from 'src/common/messages';
import { JwtAccessPayload } from '../app/auth/auth.interface';

const { SERVER_ERROR } = ResponseMessage;

@Injectable()
export class JwtHelperService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public SignAccessToken = async <T extends JwtAccessPayload>(
    payload: T,
  ): Promise<string> => {
    try {
      return this.jwtService.signAsync(payload, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRY'),
      });
    } catch (error) {
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  };

  public SignRefreshToken = async (
    payload: JwtAccessPayload,
  ): Promise<string> => {
    try {
      const refresh_token = await this.jwtService.signAsync(payload, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRY'),
      });
      return refresh_token;
    } catch (error) {
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  };

}
