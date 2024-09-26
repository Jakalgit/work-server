import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BasketItem } from './basket-item.model';
import { CreateBasketItemDto } from './dto/create-basket-item.dto';
import { Item } from '../item/models/item.model';
import { ItemService } from '../item/item.service';

@Injectable()
export class BasketItemService {
  constructor(
    @InjectModel(BasketItem) private basketItemRepository: typeof BasketItem,
    @InjectModel(Item) private itemRepository: typeof Item,
    private itemService: ItemService,
  ) {}

  async create(dto: CreateBasketItemDto) {
    const basketItem = await this.basketItemRepository.findOne({
      where: { itemId: dto.itemId, userId: dto.userId },
    });
    const item = await this.itemRepository.findOne({
      where: { id: dto.itemId },
    });

    if (basketItem) {
      throw new HttpException(
        'Такой товар уже есть в корзине у данного пользователя',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (item) {
      throw new HttpException(
        'Товара с таким id не существует',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!item.visibility) {
      throw new HttpException(
        'Товар с таким id недоступен для покупки',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.basketItemRepository.create(dto);
  }

  async incrementCount(id: number) {
    const basketItem = await this.basketItemRepository.findByPk(id);

    if (!basketItem) {
      throw new HttpException(
        'Товара в корзине с таким id не существует',
        HttpStatus.NOT_FOUND,
      );
    }

    if (basketItem.count < 99) {
      const item = await this.basketItemRepository.findByPk(basketItem.itemId);

      if (item.count > basketItem.count) {
        await basketItem.increment('count');

        return basketItem;
      } else {
        throw new HttpException(
          'Большего количества нет в наличии',
          HttpStatus.METHOD_NOT_ALLOWED,
        );
      }
    } else {
      throw new HttpException(
        'Превышение лимита',
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }
  }

  async decrementCount(id: number) {
    const basketItem = await this.basketItemRepository.findByPk(id);

    if (!basketItem) {
      throw new HttpException(
        'Товара в корзине с таким id не существует',
        HttpStatus.NOT_FOUND,
      );
    }

    if (basketItem.count > 1) {
      await basketItem.decrement('count');

      return basketItem;
    } else {
      throw new HttpException('Ошибка', HttpStatus.METHOD_NOT_ALLOWED);
    }
  }

  async getAllByUserId(id: number) {
    const basketItems = await this.basketItemRepository.findAll({
      where: { userId: id },
    });

    const itemIds: number[] = [];
    basketItems.forEach((itm) => {
      itemIds.push(itm.itemId);
    });

    return await this.itemService.getItemByIds(JSON.stringify(itemIds));
  }

  async deleteById(id: number) {
    return await this.basketItemRepository.destroy({ where: { itemId: id } });
  }

  async deleteAllByUserId(userId: number) {
    return await this.basketItemRepository.destroy({ where: { userId } });
  }
}
