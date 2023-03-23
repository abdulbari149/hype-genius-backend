import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import BusinessEntity from './app/business/entities/business.entity';
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
  @Get('/:business')
  async HandleBusinessURL(
    @Param('business') name: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const onboardingLink = `${this.configService.get(
      'app.backendDomain',
    )}/${name}`;

    const business = await this.dataSource
      .getRepository(BusinessEntity)
      .findOne({ where: [{ name }, { onboardingLink }] });

    if (!business) {
      throw new NotFoundException('Invalid URI');
    }
    const token = await this.jwtService.signAsync(
      { businessId: business.id },
      { secret: 'thisisabusinesssecret', expiresIn: '2h' },
    );

    const url = new URL(
      `${this.configService.get('app.frontendDomain')}/auth/signup/channel`,
    );
    url.searchParams.set('token', token);
    console.log(url.toString());
    res.redirect(url.toString());
  }
}
