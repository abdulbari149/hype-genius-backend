import {
  CacheModuleOptions,
  CacheOptionsFactory,
  CacheStore,
  Injectable,
} from '@nestjs/common';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-store';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheConfigService
  implements CacheOptionsFactory<RedisClientOptions>
{
  constructor(private configService: ConfigService) {}

  // eslint-disable-next-line @typescript-eslint/naming-convention
  async createCacheOptions(): Promise<CacheModuleOptions<RedisClientOptions>> {
    const store = (await redisStore({
      url: this.configService.get('cache.url'),
      ttl: this.configService.get('cache.expiry'),
    })) as unknown as CacheStore;
    return {
      ttl: this.configService.get('cache.expiry'),
      url: this.configService.get('cache.url'),
      isGlobal: true,
      store,
    };
  }
}
