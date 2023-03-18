import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import ContractService from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
@Controller({
  path: '/contracts',
  version: '1',
})
export default class ContractController {
  constructor(private contractService: ContractService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  async CreateContract(@Body() body: CreateContractDto, @Req() req: Request) {
    try {
      const response = await this.contractService.CreateContract(
        { ...body },
        req,
      );
      return { ...response, message: 'Created' };
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Put('/')
  async UpdateContract(@Body() body: CreateContractDto, @Req() req: Request) {
    try {
      const response = await this.contractService.UpdateContract(
        { ...body },
        req,
      );
      return { ...response, message: 'Updated' };
    } catch (error) {
      throw error;
    }
  }

  @Get(':business_channel_id')
  async GetContract(@Param('business_channel_id') business_channel_id: number) {
    try {
      const contract = await this.contractService.GetContract(
        business_channel_id,
      );
      return contract;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
