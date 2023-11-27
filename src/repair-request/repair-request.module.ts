import { Module } from '@nestjs/common';
import { RepairRequestService } from './repair-request.service';
import { RepairRequestController } from './repair-request.controller';

@Module({
  providers: [RepairRequestService],
  controllers: [RepairRequestController]
})
export class RepairRequestModule {}
