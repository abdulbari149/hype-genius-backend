import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Public } from './decorators/public.decorator';
import { URL } from 'url';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private dataSource: DataSource,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('/:code')
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
    let payload = {};
    if (isBusinessURL) payload = businessPayload;
    else if (isOnboardingURL) payload = onboardingPayload;

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
    url.searchParams.set('token', token);
    console.log(url.toString());
    res.redirect(url.toString());
  }
}
