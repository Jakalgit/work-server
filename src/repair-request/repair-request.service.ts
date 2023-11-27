import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {RepairRequest} from "./repair-request.model";
import {CreateRepairRequestDto} from "./dto/create-repair-request.dto";

@Injectable()
export class RepairRequestService {

  constructor(@InjectModel(RepairRequest) private repairRepository: typeof RepairRequest) {
  }

  async createRepairRequest(dto: CreateRepairRequestDto) {
    const response = false
    return this.repairRepository.create({...dto, response})
  }

  async setResponseStatus(id: number) {
    const response = true
    const repair_req = await this.repairRepository.findByPk(id)

    if (!repair_req) {
      throw new HttpException("Запрос с таким id не найден", HttpStatus.BAD_REQUEST)
    }

    repair_req.response = response
    await repair_req.save()

    return repair_req
  }

  async deleteRepairRequest(id: number) {
    const repair_req = await this.repairRepository.findByPk(id)
    if (repair_req) {
      await repair_req.destroy()
    } else {
      throw new HttpException("Запрос с таким id не найден", HttpStatus.BAD_REQUEST)
    }

    return repair_req
  }
}
