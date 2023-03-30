import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import ContractEntity from './entities/contract.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateContractDto } from './dto/create-contract.dto';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';

@Injectable()
export default class ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    private contractRepository: Repository<ContractEntity>,
    private dataSource: DataSource,
  ) {}

  public async CreateContract(body: CreateContractDto, req: Request) {
    const query_runner = this.dataSource.createQueryRunner();
    await query_runner.startTransaction();
    try {
      const mapped_contract = plainToInstance(ContractEntity, body);
      const response = await query_runner.manager.save(mapped_contract);
      await query_runner.commitTransaction();
      return response;
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw error;
    } finally {
      await query_runner.release();
    }
  }

  public async UpdateContract(body: CreateContractDto, req: Request) {
    const query_runner = this.dataSource.createQueryRunner();
    const { contract_id, ...data } = body;
    await query_runner.startTransaction();
    try {
      const contracts = await query_runner.manager.findOne(ContractEntity, {
        where: { id: contract_id },
      });
      const mapped_contract = plainToInstance(ContractEntity, data);
      const response = await query_runner.manager.save(ContractEntity, {
        ...contracts,
        ...mapped_contract,
      });
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
