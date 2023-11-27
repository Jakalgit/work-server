import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as path from "path"
import * as fs from "fs"
import * as uuid from "uuid"
import {InjectModel} from "@nestjs/sequelize";
import {OrderItem} from "../order-item/order-item.model";

@Injectable()
export class FilesService {

  constructor(@InjectModel(OrderItem) private orderItemRepository: typeof OrderItem) {
  }

  async createImageFile(file): Promise<string> {
    const extname = file.originalname.split('.').pop()
    switch (extname) {
      case "jpg":case "png":case "jpeg":case "webp":
        break
      default:
        throw new HttpException('Неверный формат изображения: доступные форматы .jpg, .jpeg, .png, .webp',
          HttpStatus.FORBIDDEN)
    }
    try {
      const fileName = uuid.v4() + '.' + extname
      const filePath = path.resolve(__dirname, '..', 'static', 'image')
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, {recursive: true})
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer)
      return fileName;
    } catch (e) {
      throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async removeImageFile(name: string) {
    try {
      const filePath = path.resolve(__dirname, '..', 'static', 'image')
      const orderItems = await this.orderItemRepository.findAll({where: {image: name}})
      if (orderItems.length === 0) {
        fs.unlinkSync(path.join(filePath, name))
      }
      return name
    } catch (e) {
      console.log(e)
    }
  }
}
