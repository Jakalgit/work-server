import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tag } from './tag.model';
import { CreateTagDto } from './dto/create-tag.dto';
import { ChangeNameDto } from './dto/change-name.dto';
import { ItemTag } from '../intermediate-tables/item-tag.model';
import { ChangeTagsDto } from './dto/change-tags.dto';
import { Op } from 'sequelize';

@Injectable()
export class TagService {

  constructor(@InjectModel(Tag) private tagRepository: typeof Tag,
              @InjectModel(ItemTag) private itemTagRepository: typeof ItemTag) {
  }

  async create(dto: CreateTagDto) {
    let candidate = await this.tagRepository.findOne({rejectOnEmpty: undefined, where: {name: dto.name}})

    if (candidate) {
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

    await this.tagRepository.update({ name: dto.name }, { where: { id: dto.id } });

    return {...tag.dataValues, name: dto.name}
  }

  async changeTagAddiction(dto: ChangeTagsDto) {
    await this.itemTagRepository.destroy({ where: { itemId: dto.id } })

    const _tag_ids = JSON.parse(dto.tags).map((el: { id: number; }) => el.id)

    const tags = await this.tagRepository.findAll({ where: {id: _tag_ids}, raw: true })
    const itemTagAddictions = await this.itemTagRepository.findAll({ where: {itemId: dto.id, tagId: {[Op.or]: _tag_ids}}, raw: true })

    const itemTagsToCreate = _tag_ids.map((id: number) => {
      if (!itemTagAddictions.find(el => el.tagId === id) && tags.find(el => el.id === id)) {
        return {itemId: dto.id, tagId: id}
      }
    })

    return await this.itemTagRepository.bulkCreate(itemTagsToCreate)
  }

  async getItemTagAddiction(id: number) {
    const itemTags = await this.itemTagRepository.findAll({ where: {itemId: id} })
    const _tag_ids = itemTags.map(el => el.tagId)
    const tags = await this.tagRepository.findAll({ where: {id: {[Op.or]: _tag_ids} }})
    return itemTags.map((el) => {
      const tag = tags.find((t) => t.id === el.tagId);
      return { ...el, name: tag.name };
    });
  }

  async deleteTag(name: string) {
    const tag = await this.tagRepository.findOne({ where: {name: name} })

    if (!tag) {
      throw new HttpException("Тегов с таким name не существует", HttpStatus.NOT_FOUND)
    }

    const tagData = tag.dataValues

    await this.itemTagRepository.destroy({ where: {tagId: tagData.id} })
    await this.tagRepository.destroy({ where: {id: tagData.id} })
    return tag
  }

  async getOne(id: number) {
    return await this.tagRepository.findOne({ where: {id} })
  }

  async getAll() {
    return await this.tagRepository.findAll()
  }
}
