import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Image} from "./image.model";
import {FilesService} from "../files/files.service";
import { Op, Transaction } from 'sequelize';

@Injectable()
export class ImageService {

  constructor(@InjectModel(Image) private imageRepository: typeof Image,
              private fileService: FilesService) {
  }

  async create(itemId: number, images: any[], transaction: Transaction) {
    const imageObjects = []

    for (let i = 0; i < images.length; i++) {
      const name = await this.fileService.createImageFile(images[i])
      imageObjects.push({filename: name, index: i, itemId})
    }

    return await this.imageRepository.bulkCreate(imageObjects, {transaction})
  }

  async changeImage(id: number, imageFile: any) {
    const image = await this.imageRepository.findByPk(id)

    if (!image) {
      throw new HttpException('Изображение с таким id не найдено', HttpStatus.NOT_FOUND)
    }

    await this.fileService.removeImageFile(image.filename)
    image.filename = await this.fileService.createImageFile(imageFile)
    await image.save()

    return image
  }

  async deleteImage(id: number) {
    const image = await this.imageRepository.findByPk(id)

    if (!image) {
      throw new HttpException('Изображение с таким id не найдено', HttpStatus.NOT_FOUND)
    }

    await this.fileService.removeImageFile(image.filename)
    await image.destroy()

    return image
  }

  async getImagesByItemId(itemId: number, raw: boolean = true) {
    return await this.imageRepository.findAll({where: {itemId}, raw})
  }

  async getPreviewsByItemIds(itemIds: number[]) {
    return await this.imageRepository.findAll({
      where: {
        itemId: {[Op.or]: itemIds},
        index: 0,
      }
    })
  }
}
