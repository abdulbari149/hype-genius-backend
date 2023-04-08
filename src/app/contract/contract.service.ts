import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import ContractEntity from './entities/contract.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateContractDto } from './dto/create-contract.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateContractDto } from './dto/update-contract.dto';
import { BusinessChannelAlertsEntity } from '../alerts/entities/business_channel_alerts.entity';
import { Alerts } from 'src/constants/alerts';
import { AlertsEntity } from '../alerts/entities/alerts.entity';

@Injectable()
export default class ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    private contractRepository: Repository<ContractEntity>,
    private dataSource: DataSource,
  ) {}

  public async CreateContract(body: CreateContractDto) {
    const query_runner = this.dataSource.createQueryRunner();
    await query_runner.startTransaction();
    try {
      const contractExists = await query_runner.manager.findOne(
        ContractEntity,
        { where: { business_channel_id: body.business_channel_id } },
      );

      if (contractExists) {
        throw new ConflictException('Contract Exists');
      }

      const mapped_contract = plainToInstance(ContractEntity, body);
      const response = await query_runner.manager.save(mapped_contract);
      const alert = await query_runner.manager.findOne(AlertsEntity, {
        where: { name: Alerts.MISSING_DEAL },
      });
      const missing_deal_alert = await query_runner.manager.findOne(
        BusinessChannelAlertsEntity,
        {
          where: {
            business_channel_id: body.business_channel_id,
            alert_id: alert.id,
          },
          loadEagerRelations: false,
        },
      );

      if (missing_deal_alert) {
        await missing_deal_alert.softRemove();
      }
      await query_runner.commitTransaction();
      return response;
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw error;
    } finally {
      await query_runner.release();
    }
  }

  public async UpdateContract(id: number, data: UpdateContractDto) {
    const query_runner = this.dataSource.createQueryRunner();
    await query_runner.startTransaction();
    try {
      const contract = await query_runner.manager.findOne(ContractEntity, {
        where: { id: id, business_channel_id: data.business_channel_id },
      });

      if (!contract) {
        throw new NotFoundException('Contract not found');
      }
      const updated_contract = plainToInstance(ContractEntity, {
        ...contract,
        ...data,
      });
      const response = await query_runner.manager.save(updated_contract);
      await query_runner.commitTransaction();
      return response;
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw error;
    } finally {
      await query_runner.release();
    }
  }

  public async GetContract(business_channel_id: number) {
    const contract = await this.contractRepository.findOne({
      where: { business_channel_id },
    });
    return contract;
  }
}
