import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Req,
  Res,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Public } from './decorators/public.decorator';
import { URL } from 'url';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private dataSource: DataSource,
    private configService: ConfigService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Public()
  @Get()
  index() {
    return this.appService.index();
  }

  @Public()
  @Get('health')
  async health(
    @Res({ passthrough: true }) res: Response,
  ): Promise<{
    status: string;
    database: { status: string };
    redis: { status: string };
  }> {
    const [dbOk, redisOk] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
    ]);
    const healthy = dbOk && redisOk;
    res.status(healthy ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE);
    return {
      status: healthy ? 'ok' : 'error',
      database: { status: dbOk ? 'up' : 'down' },
      redis: { status: redisOk ? 'up' : 'down' },
    };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  private async checkRedis(): Promise<boolean> {
    const key = '__health_check__';
    try {
      await this.cacheManager.set(key, 'ok', 1_000);
      const got = await this.cacheManager.get<string>(key);
      await this.cacheManager.del(key);
      return got === 'ok';
    } catch {
      return false;
    }
  }

  /** Public onboarding at `GET /r/:code` (no /api prefix) — see main.ts globalPrefix exclude. */
  @Version(VERSION_NEUTRAL)
  @Public()
  @Get('r/:code')
  async handleOnboardingURL(
    @Param('code') code: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const [
      [isBusinessURL, businessPayload],
      [isOnboardingURL, onboardingPayload],
    ] = await Promise.all([
      this.appService.isBusinesOnboardingURL(code),
      this.appService.isOnboardingRequestURL(code),
    ]);
    let payload: Partial<{ businessId: number; onboardingId?: number }>;
    if (isBusinessURL) payload = businessPayload;
    else if (isOnboardingURL) payload = onboardingPayload;
    else payload = {};

    const secret = this.configService.getOrThrow('jwt.onboarding_first.secret');
    const expiresIn = this.configService.getOrThrow(
      'jwt.onboarding_first.expiresIn',
    );
    const token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });

    const url = new URL(
      `${this.configService.get('app.frontendDomain')}/auth/signup/channel`,
    );
    url.searchParams.set('token', encodeURIComponent(token));
    console.log(url.toString());
    res.redirect(url.toString());
  }
}
