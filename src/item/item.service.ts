import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Item, ItemCreationAttrs } from './models/item.model';
import { CreateItemDto } from './dto/create-item.dto';
import { ImageService } from '../image/image.service';
import { ItemTag } from '../intermediate-tables/item-tag.model';
import { Op } from 'sequelize';
import { Tag } from '../tag/tag.model';
import { ChangeItemDto } from './dto/change-item.dto';
import { GetItemFilterDto } from './dto/get-item-filter.dto';
import { ItemInfo } from './models/info.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item) private itemRepository: typeof Item,
    @InjectModel(ItemTag) private itemTagRepository: typeof ItemTag,
    @InjectModel(ItemInfo) private itemInfoRepository: typeof ItemInfo,
    @InjectModel(Tag) private tagRepository: typeof Tag,
    private readonly sequelize: Sequelize,
    private imageService: ImageService,
  ) {}

  async create(dto: CreateItemDto, imageFiles: any[]) {
    const transaction = await this.sequelize.transaction();

    try {
      const tagIds: number[] = JSON.parse(dto.tagIds)
      const infoBlocks: string[] = JSON.parse(dto.infos)

      const candidate = await this.itemRepository.findOne({
        rejectOnEmpty: undefined,
        where: { article: dto.article },
        raw: true,
        transaction
      });

      // Check if there is an item with this article
      if (candidate) {
        throw new HttpException(
          'A product with this article already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check length information blocks
      if (infoBlocks.length < 1) {
        throw new BadRequestException(
          'The number of information blocks cannot be less than 1'
        )
      }

      // Check if there is a zero infoblock
      if (infoBlocks.find(el => el.length === 0)) {
        throw new BadRequestException(
          'Length in the information block cannot be zero'
        )
      }

      const itemCreateDto: ItemCreationAttrs = {
        name: dto.name,
        price: dto.price,
        article: dto.article,
        count: dto.count,
        visibility: dto.visibility,
        availability: dto.availability
      }

      // Creating an item
      const item = await this.itemRepository.create(itemCreateDto, {transaction});

      let dtoItemTags = [];

      // Checking the existence of the passed tags
      if (tagIds.length !== 0) {
        const tags_candidate = await this.tagRepository.findAll({
          where: { id: { [Op.or]: tagIds } },
          transaction
        });
        if (tags_candidate.length !== tagIds.length) {
          throw new BadRequestException(
            'Одного или нескольких тегов не существует'
          );
        }
        dtoItemTags = tagIds.map(id => ({ tagId: id, itemId: item.dataValues.id }))
      }

      // Creating images
      await this.imageService.create(item.dataValues.id, imageFiles, transaction);

      // Creating itemTags
      if (dtoItemTags.length !== 0) {
        await this.itemTagRepository.bulkCreate(dtoItemTags, {transaction});
      }

      // Creating information blocks for item
      const itemInfosCreate = infoBlocks.map(el => ({text: el, itemId: item.dataValues.id}))
      if (itemInfosCreate.length !== 0) {
        await this.itemInfoRepository.bulkCreate(itemInfosCreate, {transaction})
      }

      // Commit transaction
      await transaction.commit();

      return item;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async changeItem(dto: ChangeItemDto) {
    const item = await this.itemRepository.findByPk(dto.id);
    const tagIds: number[] = JSON.parse(dto.tagIds);

    if (!item) {
      throw new HttpException(
        'Товара с таким id не существует',
        HttpStatus.NOT_FOUND,
      );
    }

    if (tagIds.length !== 0) {
      const tagCandidates = await this.tagRepository.findAll({
        where: { id: { [Op.or]: tagIds } },
      });
      if (tagCandidates.length !== tagIds.length) {
        throw new HttpException(
          'Один или несколько тегов не существует',
          HttpStatus.NOT_FOUND,
        );
      }
      const itemTagCandidates = await this.itemTagRepository.findAll({
        where: {
          itemId: dto.id,
        },
      });
      const tagsForAdd = [];
      const itemTagIdsForDelete = [];
      tagIds.forEach((id) => {
        if (!itemTagCandidates.find((el) => el.tagId === id)) {
          tagsForAdd.push({ tagId: id, itemId: dto.id });
        }
      });
      itemTagCandidates.forEach((itemTag) => {
        if (!tagIds.find((id) => id === itemTag.tagId)) {
          itemTagIdsForDelete.push(itemTag.tagId);
        }
      });

      if (itemTagIdsForDelete.length !== 0) {
        await this.itemTagRepository.destroy({
          where: {
            itemId: dto.id,
            tagId: {
              [Op.or]: itemTagIdsForDelete,
            },
          },
        });
      }

      if (tagsForAdd.length !== 0) {
        await this.itemTagRepository.bulkCreate(tagsForAdd);
      }
    }

    item.name = dto.name;
    item.price = dto.price;
    item.article = dto.article;
    item.count = dto.count;
    item.visibility = dto.visibility;

    await item.save();

    return item;
  }

  async changeImage(id: number, file: any) {
    return this.imageService.changeImage(id, file);
  }

  async deleteImage(id: number) {
    return this.imageService.deleteImage(id);
  }

  async getOne(id: number) {
    const item = await this.itemRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id },
      raw: true,
    });

    if (!item) {
      throw new HttpException(
        'Товара с таким id не существует',
        HttpStatus.NOT_FOUND,
      );
    }

    const itemTags = await this.itemTagRepository.findAll({ where: {itemId: id}, raw: true })
    const tagIds = itemTags.map(el => el.tagId)
    const tags = (await this.tagRepository.findAll({
      where: {
        id: {[Op.or]: tagIds}
      },
      raw: true,
    })).map(el => ({...el, isChanged: false}))

    const infoBlocks = await this.itemInfoRepository.findAll({ where: {itemId: id}, raw: true })
    const images = await this.imageService.getImagesByItemId(id);

    return { ...item, images, infoBlocks, tags };
  }

  async getAll() {
    const items = await this.itemRepository.findAll({raw: true});
    return await this.addPreviewToItems(items);
  }

  async getAllByFilterPage(dto: GetItemFilterDto) {
    const limit = 12;
    const offset = dto.page * limit - limit;
    const tagIds = JSON.parse(dto.tagIds);
    let itemTags = [];
    if (tagIds.length !== 0) {
      itemTags = await this.itemTagRepository.findAll({
        where: {
          tagId: {
            [Op.or]: tagIds,
          }
        }
      })
    }
    const itemIds: number[] = itemTags.map((el) => el.itemId);
    let where: any = {
      visibility: true,
      name: { [Op.iRegexp]: `${dto.finder || ''}` },
      price: {
        [Op.gte]: dto.min_price,
      }
    }

    if (dto.max_price > 0) {
      where.price = {
        ...where.price,
        [Op.lte]: dto.max_price,
      };
    }

    if (itemIds.length !== 0) {
      where.id = { [Op.or]: itemIds };
    }

    const result = await this.itemRepository.findAndCountAll({
      where,
      raw: true,
      limit,
      offset,
    });

    result.rows = await this.addPreviewToItems(result.rows);
    const totalPages = Math.ceil(result.count / limit);

    return {
      records: result.rows,
      totalPages,
    }
  }

  async getPrices() {
    const items = await this.itemRepository.findAll({
      where: { visibility: true },
    });
    let min = 0,
      max = 0;
    if (items.length !== 0) {
      items.sort((prev, next) => prev.price - next.price);
      min = items[0].price;
      max = items[items.length - 1].price;
    }
    return { min, max };
  }

  async getItemByIds(array: string) {
    const itemIds = JSON.parse(array);
    const items = await this.itemRepository.findAll({
      where: { id: { [Op.or]: itemIds } },
    });

    return this.addPreviewToItems(items);
  }

  private async addPreviewToItems(items: any[]) {
    const itemIds: number[] = items.map(el => el.id)
    const images = await this.imageService.getPreviewsByItemIds(itemIds);
    for (let i = 0; i < items.length; i++) {
      const image = images.at(
        images.findIndex((el) => el.itemId === items[i].id),
      );
      items[i] = { ...items[i], image };
    }
    return items;
  }

  private checkIdInArray(array: any[], ids: number[]) {
    for (let i = 0; i < ids.length; i++) {
      if (!array.find((el) => el.itemId === ids[i])) {
        ids = ids.filter((id) => id !== ids[i]);
      }
    }
    return ids;
  }
}
