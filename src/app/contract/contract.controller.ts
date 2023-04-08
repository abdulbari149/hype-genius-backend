import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import ContractService from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import ResponseEntity from 'src/helpers/ResponseEntity';
import { UpdateContractDto } from './dto/update-contract.dto';
@Controller({
  path: '/contracts',
  version: '1',
})
export default class ContractController {
  constructor(private contractService: ContractService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  async CreateContract(@Body() body: CreateContractDto, @Req() req: Request) {
    const response = await this.contractService.CreateContract(body);
    return new ResponseEntity(
      response,
      'Contract Created Successfully',
      HttpStatus.CREATED,
    );
  }

  @HttpCode(HttpStatus.CREATED)
  @Put('/:id')
  async UpdateContract(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateContractDto,
  ) {
    const response = await this.contractService.UpdateContract(id, body);
    return { ...response, message: 'Updated' };
  }

  @Get(':business_channel_id')
  async GetContract(@Param('business_channel_id') business_channel_id: number) {
    const contract = await this.contractService.GetContract(
      business_channel_id,
    );
    return new ResponseEntity(contract, 'Contract Updated Successfully');
  }
}
