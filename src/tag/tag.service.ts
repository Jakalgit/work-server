import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Tag} from "./tag.model";
import {CreateTagDto} from "./dto/create-tag.dto";
import {ChangeNameDto} from "./dto/change-name.dto";
import {ItemTag} from "../intermediate-tables/item-tag.model";

@Injectable()
export class TagService {

  constructor(@InjectModel(Tag) private tagRepository: typeof Tag,
              @InjectModel(ItemTag) private itemTagRepository: typeof ItemTag) {
  }

  async create(dto: CreateTagDto) {
    let candidate = await this.tagRepository.findOne({rejectOnEmpty: undefined, where: {name: dto.name}})

    if (!candidate) {
      throw new HttpException("Тег с таким названием уже существует", HttpStatus.BAD_REQUEST)
    }

    candidate = await this.tagRepository.create(dto)

    return candidate
  }

  async changeName(dto: ChangeNameDto) {
    const tag = await this.tagRepository.findByPk(dto.id)
    const candidate = await this.tagRepository.findOne({rejectOnEmpty: undefined, where: {name: dto.name}})

    if (!tag) {
      throw new HttpException("Тегов с таким id не существует", HttpStatus.NOT_FOUND)
    }

    if (candidate) {
      throw new HttpException("Тег с таким названием уже существует", HttpStatus.BAD_REQUEST)
    }

    tag.name = dto.name
    await tag.save()

    return tag
  }

  async deleteTag(id: number) {
    const tag = await this.tagRepository.findByPk(id)

    if (!tag) {
      throw new HttpException("Тегов с таким id не существует", HttpStatus.NOT_FOUND)
    }

    await this.itemTagRepository.destroy({where: {tagId: id}})
    await tag.destroy()
    return tag
  }
}
