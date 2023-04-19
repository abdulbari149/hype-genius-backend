import OnboardRequestsEntity from './app/channels/entities/onboard_requests.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import BusinessEntity from './app/business/entities/business.entity';
import ResponseEntity from './helpers/ResponseEntity';

type IsURLType<T> = [true, T] | [false, null];

@Injectable()
export class AppService {
  constructor(
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {}

  index(): ResponseEntity<null> {
    return new ResponseEntity(null, 'Hypegenius Backend Is Working Fine!!!');
  }

  public async isBusinesOnboardingURL(
    name: string,
  ): Promise<IsURLType<{ businessId: number }>> {
    const onboardingLink = `${this.configService.get(
      'app.backendDomain',
    )}/${name}`;

    const business = await this.dataSource
      .getRepository(BusinessEntity)
      .findOne({ where: [{ name }, { onboardingLink }] });

    if (!business) return [false, null];
    return [true, { businessId: business.id }];
  }

  public async isOnboardingRequestURL(
    code: string,
  ): Promise<IsURLType<{ businessId: number; onboardingId: number }>> {
    const onboardingLink = `${this.configService.get(
      'app.backendDomain',
    )}/${code}`;
    const onboarding_request = await this.dataSource
      .getRepository(OnboardRequestsEntity)
      .findOne({
        where: { link: onboardingLink },
      });

    if (!onboarding_request) return [false, null];
    const payload = {
      businessId: onboarding_request.business_id,
      onboardingId: onboarding_request.id,
    };
    return [true, payload];
  }
}
