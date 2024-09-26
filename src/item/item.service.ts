import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Item } from './models/item.model';
import { CreateItemDto } from './dto/create-item.dto';
import { ImageService } from '../image/image.service';
import { ItemTag } from '../intermediate-tables/item-tag.model';
import { Op } from 'sequelize';
import { Tag } from '../tag/tag.model';
import { Color } from '../color/color.model';
import { ChangeItemDto } from './dto/change-item.dto';
import { GetItemFilterDto } from './dto/get-item-filter.dto';
import { Discount } from './models/discount.model';
import { Novelty } from './models/novelty.model';
import { Popular } from './models/popular.model';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item) private itemRepository: typeof Item,
    @InjectModel(ItemTag) private itemTagRepository: typeof ItemTag,
    @InjectModel(Tag) private tagRepository: typeof Tag,
    @InjectModel(Color) private colorRepository: typeof Color,
    @InjectModel(Discount) private discountRepository: typeof Discount,
    @InjectModel(Novelty) private noveltyRepository: typeof Novelty,
    @InjectModel(Popular) private popularRepository: typeof Popular,
    private imageService: ImageService,
  ) {}

  async create(dto: CreateItemDto, imageFiles: any[]) {
    const candidate = await this.itemRepository.findOne({
      rejectOnEmpty: undefined,
      where: { article: dto.article },
    });
    const tagIds: number[] = JSON.parse(dto.tagIds);

    if (candidate) {
      throw new HttpException(
        'Товар с таким артиклем уже существует',
        HttpStatus.NOT_FOUND,
      );
    }

    const dropDto = dto;
    delete dropDto.tagIds;

    const colorCandidate = await this.colorRepository.findByPk(dto.colorId);

    if (!colorCandidate) {
      throw new HttpException(
        'Группы цветов с таким id не существует',
        HttpStatus.NOT_FOUND,
      );
    }

    const dtoItemTags = [];

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
      tagIds.forEach((id) => {
        dtoItemTags.push({ tagId: id, itemId: item.id });
      });
    }

    const item = await this.itemRepository.create(dropDto);

    await this.imageService.create(item.id, imageFiles);

    if (dtoItemTags.length !== 0) {
      await this.itemTagRepository.bulkCreate(dtoItemTags);
    }

    return item;
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

    const colorCandidate = await this.colorRepository.findByPk(dto.colorId);

    if (!colorCandidate) {
      throw new HttpException(
        'Группы цветов с таким id не существует',
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
    item.length = dto.length;
    item.width = dto.width;
    item.height = dto.height;
    item.weight = dto.weight;
    item.count = dto.count;
    item.colorId = dto.colorId;
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
      where: { id, visibility: true },
    });

    if (!item) {
      throw new HttpException(
        'Товара с таким id не существует',
        HttpStatus.NOT_FOUND,
      );
    }

    const images = await this.imageService.getImagesByItemId(id);

    return { ...item, images };
  }

  async getAll() {
    const items = await this.itemRepository.findAll();
    return await this.addPreviewToItems(items);
  }

  async getAllByFilterPage(dto: GetItemFilterDto) {
    const limit = 12;
    const offset = dto.page * limit - limit;
    const tagIds = JSON.parse(dto.tags);
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
    if (dto.discount) {
      const discounts = await this.discountRepository.findAll({
        where: { id: { [Op.or]: itemIds } },
      });
      itemIds = this.checkIdInArray(discounts, itemIds);
    }
    if (dto.popular) {
      const populars = await this.popularRepository.findAll({
        where: { id: { [Op.or]: itemIds } },
      });
      itemIds = this.checkIdInArray(populars, itemIds);
    }
    if (dto.novelty) {
      const novelties = await this.noveltyRepository.findAll({
        where: { id: { [Op.or]: itemIds } },
      });
      itemIds = this.checkIdInArray(novelties, itemIds);
    }
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
      const all_items = await this.itemRepository.findAll(options);
      const items_row = await this.itemRepository.findAndCountAll({
        where: options.where,
        limit,
        offset,
      });
      items_row.rows = await this.addPreviewToItems(items_row.rows);
      const count = Math.floor(all_items.length / limit);
      return { ...items_row, pageCount: count !== 0 ? count : 1 };
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
    const itemIds: number[] = [];
    items.forEach((item) => itemIds.push(item.id));
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
