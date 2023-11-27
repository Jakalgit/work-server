import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Image} from "./image.model";
import {FilesService} from "../files/files.service";
import {Op} from "sequelize";

@Injectable()
export class ImageService {

  constructor(@InjectModel(Image) private imageRepository: typeof Image,
              private fileService: FilesService) {
  }

  async create(itemId:number, images: any[]) {
    const imageObjects = []

    for (let i = 0; i < images.length; i++) {
      const name = this.fileService.createImageFile(images[i])
      imageObjects.push({name: name, index: i, itemId})
    }

    return await this.imageRepository.bulkCreate(imageObjects)
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

  async getImagesByItemId(itemId: number) {
    return await this.imageRepository.findAll({where: {itemId}})
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
