import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import CronJobService from './cron.job.service';

@Injectable()
export default class UploadFrequencyCronJob {
  constructor(private cronJobService: CronJobService) {}
  @Cron('0 0 1 * * *')
  public async handleCron() {
    const result = await this.cronJobService.validateVideoCountCronJob();
    return result;
  }
}
