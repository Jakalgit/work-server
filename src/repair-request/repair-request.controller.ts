import {Body, Controller, Delete, Param, Post, Put} from '@nestjs/common';
import {RepairRequestService} from "./repair-request.service";
import {CreateRepairRequestDto} from "./dto/create-repair-request.dto";

@Controller('repair-request')
export class RepairRequestController {

  constructor(private repairRequestService: RepairRequestService) {
  }

  @Post('/')
  create(@Body() dto: CreateRepairRequestDto) {
    return this.repairRequestService.createRepairRequest(dto)
  }

  @Put('/set-checked')
  setCheckedRequest(@Body() id: number) {
    return this.repairRequestService.setResponseStatus(id)
  }

  @Delete('/:id')
  deleteRepairRequest(@Param('id') id: number) {
    return this.repairRequestService.deleteRepairRequest(id)
  }
}
