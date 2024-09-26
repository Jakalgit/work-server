import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Color } from './color.model';
import { Item } from '../item/models/item.model';
import { CreateColorDto } from './dto/create-color.dto';
import { ChangeNameDto } from './dto/change-name.dto';

@Injectable()
export class ColorService {
  constructor(
    @InjectModel(Color) private colorRepository: typeof Color,
    @InjectModel(Item) private itemRepository: typeof Item,
  ) {}

  async create(dto: CreateColorDto) {
    const color = await this.colorRepository.findOne({
      where: { name: dto.name },
    });

    if (color) {
      throw new HttpException(
        'Группа цветов с таким названием уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.colorRepository.create(dto);
  }

  async changeName(dto: ChangeNameDto) {
    const color = await this.colorRepository.findOne({ where: { id: dto.id } });

    if (color) {
      throw new HttpException(
        'Группа цветов с таким названием уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }

    color.name = dto.name;
    await color.save();

    return color;
  }

  async delete(id: number) {
    return await this.colorRepository.destroy({ where: { id } });
  }
}
