import { Module } from '@nestjs/common';
import { RepairRequestService } from './repair-request.service';
import { RepairRequestController } from './repair-request.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {RepairRequest} from "./repair-request.model";

@Module({
  providers: [RepairRequestService],
  controllers: [RepairRequestController],
  imports: [
    SequelizeModule.forFeature([RepairRequest])
  ]
})
export class RepairRequestModule {}
