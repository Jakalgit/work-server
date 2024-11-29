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
import { Discount } from './models/discount.model';
import { Novelty } from './models/novelty.model';
import { Popular } from './models/popular.model';
import { ItemInfo } from './models/info.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item) private itemRepository: typeof Item,
    @InjectModel(ItemTag) private itemTagRepository: typeof ItemTag,
    @InjectModel(ItemInfo) private itemInfoRepository: typeof ItemInfo,
    @InjectModel(Tag) private tagRepository: typeof Tag,
    @InjectModel(Discount) private discountRepository: typeof Discount,
    @InjectModel(Novelty) private noveltyRepository: typeof Novelty,
    @InjectModel(Popular) private popularRepository: typeof Popular,
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
            'One or more tags do not exist'
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
      const tags_candidate = await this.tagRepository.findAll({
        where: { id: { [Op.or]: tagIds } },
      });
      if (tags_candidate.length !== tagIds.length) {
        throw new HttpException(
          'Один или несколько жанров не существует',
          HttpStatus.NOT_FOUND,
        );
      }
      const item_tag_list = await this.itemTagRepository.findAll({
        where: {
          itemId: dto.id,
        },
      });
      const tagsForAdd = [];
      const itemTagIdsForDelete = [];
      tagIds.forEach((id) => {
        if (!item_tag_list.find((el) => el.tagId === id)) {
          tagsForAdd.push({ tagId: id, itemId: dto.id });
        }
      });
      item_tag_list.forEach((itemTag) => {
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
    const limit = 120;
    const offset = dto.page * limit - limit;
    const tagIds = JSON.parse(dto.tagIds);
    let itemIds = [];
    let item_tags = [];
    if (tagIds.length !== 0) {
      item_tags = await this.itemTagRepository.findAll({
        where: { tagId: { [Op.or]: tagIds } },
      });
    }

    item_tags.forEach((el) => {
      if (itemIds.indexOf(el.itemId) === -1) {
        itemIds.push(el.itemId);
      }
    });

    if (itemIds.length === 0 && tagIds.length !== 0) {
      return { count: 0, rows: [], pageCount: 0 };
    } else {
      const options = {
        where: {
          id: { [Op.or]: itemIds },
          price: { [Op.gte]: dto.min_price, [Op.lte]: dto.max_price },
          name: { [Op.iRegexp]: `${dto.name}` },
          visibility: true,
        },
      };
      const items = await this.itemRepository.findAndCountAll({
        // where: options.where,
        limit,
        offset,
        raw: true,
      });

      // Общее количество записей
      const totalRecords = items.count;

      // Общее количество страниц
      const totalPages = Math.ceil(totalRecords / 12);

      items.rows = await this.addPreviewToItems(items.rows);

      return { ...items, totalPages};
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

  async addDiscount(id: number, price: number) {
    const item = await this.itemRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id },
    });

    if (!item) {
      throw new HttpException(
        'Товара с таким id не существует',
        HttpStatus.NOT_FOUND,
      );
    }

    if (price >= item.price) {
      throw new HttpException(
        'Скидочная цена должна быть меньше основной',
        HttpStatus.BAD_REQUEST,
      );
    }

    let discount = await this.discountRepository.findOne({
      rejectOnEmpty: undefined,
      where: { itemId: id },
    });

    if (discount) {
      throw new HttpException(
        'Скидка для этого товара уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }

    discount = await this.discountRepository.create({
      itemId: id,
      old_price: item.price,
    });

    item.price = price;
    await item.save();

    return discount;
  }

  async deleteDiscount(id: number) {
    const discount = await this.discountRepository.findOne({
      rejectOnEmpty: undefined,
      where: { itemId: id },
    });

    if (!discount) {
      throw new HttpException(
        'Скидка для этого товара не найдена',
        HttpStatus.NOT_FOUND,
      );
    }

    await discount.destroy();

    return discount;
  }

  async addToNovelty(id: number) {
    const item = await this.itemRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id },
    });

    if (!item) {
      throw new HttpException(
        'Товара с таким id не существует',
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.noveltyRepository.create({ itemId: id });
  }

  async deleteFromNovelty(id: number) {
    const item = await this.itemRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id },
    });

    if (!item) {
      throw new HttpException(
        'Товара с таким id не существует',
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.noveltyRepository.destroy({ where: { itemId: id } });
  }

  async addToPopular(id: number) {
    const item = await this.itemRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id },
    });

    if (!item) {
      throw new HttpException(
        'Товара с таким id не существует',
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.popularRepository.create({ itemId: id });
  }

  async deleteFromPopular(id: number) {
    const item = await this.itemRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id },
    });

    if (!item) {
      throw new HttpException(
        'Товара с таким id не существует',
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.popularRepository.destroy({ where: { itemId: id } });
  }

  private async addPreviewToItems(items: any[]) {
    const itemIds: number[] = items.map(el => el.id)
    const images = await this.imageService.getPreviewsByItemIds(itemIds);
    for (let i = 0; i < items.length; i++) {
      const image = images.at(
        images.findIndex((el) => el.itemId === items[i].id),
      );
      items[i] = { ...items[i], filename: image.filename };
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
