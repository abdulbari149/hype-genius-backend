import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import ChannelEntity from './entities/channels.entity';
import { InjectRepository } from '@nestjs/typeorm';
import OnboardRequestsEntity from './entities/onboard_requests.entity';
import { UpdateOnboardingDto } from './dto/update-onboarding.dto';
import { pick } from 'src/utils/pick';
import BusinessChannelEntity from '../business/entities/business.channel.entity';
import { BusinessResponse } from '../business/dto/business-response.dto';
import { JwtAccessPayload } from '../auth/auth.interface';
import { ContractResponseDto } from '../contract/dto/contract-response.dto';
@Injectable()
export default class ChannelService {
  constructor(
    @InjectRepository(ChannelEntity)
    private channelRepository: Repository<ChannelEntity>,
    @InjectRepository(OnboardRequestsEntity)
    private onboardRequestsRepository: Repository<OnboardRequestsEntity>,
    @InjectRepository(BusinessChannelEntity)
    private businessChannelRepository: Repository<BusinessChannelEntity>,
  ) {}

  public async getChannelAnalytics(payload: JwtAccessPayload) {
    const where = {
      userId: payload.user_id,
      channelId: payload.channel_id,
    };
    const videoQuery = this.businessChannelRepository
      .createQueryBuilder('bc')
      .select([
        'count(v.id) as no_of_uploads',
        'sum(v.views) as total_views',
        'sum(p.channel_amount) as amount_earned',
      ])
      .leftJoin('bc.videos', 'v')
      .leftJoin('v.payments', 'p')
      .where('bc.user_id=:userId and bc.channel_id=:channelId', where);
    const contractQuery = this.businessChannelRepository
      .createQueryBuilder('bc')
      .innerJoinAndSelect('bc.contract', 'c')
      .where('bc.user_id=:userId and bc.channel_id=:channelId', where);
    const [videoData, contractData] = await Promise.all([
      videoQuery.getRawOne(),
      contractQuery.getMany(),
    ]);
    console.log(videoData, contractData);
    return {
      ...videoData,
      contracts: plainToInstance(
        ContractResponseDto,
        contractData.map((c) => c.contract),
      ),
    };
  }

  private async generateOnboardingLink() {
    const retyCount = 5;
    let count = 0;
    let urlExists = false;
    let link = '';
    do {
      const code = Array(4)
        .fill(0)
        .map(() => Math.floor(Math.random() * 100).toString(16))
        .join('');
      link = `${process.env.BACKEND_DOMAIN}/${code}`;
      const onboardRequests = await this.onboardRequestsRepository.findOne({
        where: { link },
      });
      count++;
      urlExists = !!onboardRequests;
    } while (urlExists && count < retyCount);
    return link;
  }

  public async createOnboarding(
    business_id: number,
  ): Promise<OnboardRequestsEntity> {
    const link = await this.generateOnboardingLink();
    const onboard_request_entity = plainToInstance(OnboardRequestsEntity, {
      data: {},
      business_id,
      link,
    });
    return await this.onboardRequestsRepository.save(onboard_request_entity);
  }

  public async updateOnboarding(data: UpdateOnboardingDto) {
    const { onboarding_id, ...updated_data } = data;
    const onboarding_req = await this.onboardRequestsRepository.findOne({
      where: { id: onboarding_id },
      loadEagerRelations: false,
    });
    const contract_data = pick(
      updated_data,
      'amount',
      'is_one_time',
      'currency_id',
      'upload_frequency',
      'note',
      'budget',
    );
    const tags_data = pick(updated_data, 'tags');
    if (!onboarding_req?.data?.contract) {
      onboarding_req.data.contract = {};
    }
    onboarding_req.data.contract = {
      ...onboarding_req.data.contract,
      ...contract_data,
    };
    if (!onboarding_req?.data?.tags) {
      onboarding_req.data.tags = [];
    }
    if (
      typeof tags_data?.tags !== 'undefined' &&
      tags_data?.tags &&
      Array.isArray(tags_data?.tags) &&
      tags_data.tags.length > 0
    ) {
      const newTags = [...onboarding_req.data.tags, ...tags_data.tags];
      onboarding_req.data.tags = newTags;
    }
    return await this.onboardRequestsRepository.save(onboarding_req);
  }

  public async getPartnerShips(userId: number) {
    const data = await this.businessChannelRepository.find({
      where: { userId },
      loadEagerRelations: false,
      relations: { business: true },
      select: { business: { name: true, id: true } },
    });
    return data.map((value) =>
      plainToInstance(BusinessResponse, value.business),
    );
  }
}
