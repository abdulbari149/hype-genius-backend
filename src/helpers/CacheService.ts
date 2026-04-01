import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getFromCache<T>(key: string) {
    return await this.cacheManager.get<T>(key);
  }

  async addToCache<T>(key: string, data: T, ttl?: number) {
    return await this.cacheManager.set(key, data, ttl);
  }
}
