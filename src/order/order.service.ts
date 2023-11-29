import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Order} from "./models/order.model";
import {CreateOrderDto} from "./dto/create-order.dto";
import {Item} from "../item/models/item.model";
import {Op} from "sequelize";
import {BasketItem} from "../basket-item/basket-item.model";
import {ItemService} from "../item/item.service";
import {OrderItem} from "./models/order-item.model";

@Injectable()
export class OrderService {

  constructor(@InjectModel(Order) private orderRepository: typeof Order,
              @InjectModel(Item) private itemRepository: typeof Item,
              @InjectModel(BasketItem) private basketItemRepository: typeof BasketItem,
              @InjectModel(OrderItem) private orderItemRepository: typeof OrderItem,
              private itemService: ItemService
              ) {
  }

  async create(dto: CreateOrderDto) {
    let fullPrice: number = 0
    const basketItemIds = JSON.parse(dto.basketItemIds)
    const itemIds = []
    basketItemIds.forEach(el => itemIds.push(el.itemId))
    let items = await this.itemService.getItemByIds(JSON.stringify(itemIds))
    items = items.filter(el => el.visibility === true)

    if (items.length !== itemIds.length) {
      throw new HttpException("Один или нескольо товаров в корзине недоступны для заказа", HttpStatus.BAD_REQUEST)
    }

    if ((dto.typeDelivery === 1 || dto.typeDelivery === 2) && dto.typePay !== 1) {
      throw new HttpException("Недопустимый способ оплаты для выбранного типа получения заказа", HttpStatus.BAD_REQUEST)
    }

    const basketItems = await this.basketItemRepository.findAll({where:
        {id: {[Op.or]: basketItemIds}}
    })
    items.forEach(item => {
      const basketItem = basketItems.find(el => el.itemId === item.id)
      fullPrice += item.price * basketItem.count
    })

    const order = await this.orderRepository.create({
      token: dto.token,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      date: Date.now(),
      price: fullPrice,
      typePay: dto.typePay,
      typeDelivery: dto.typeDelivery,
    })

    const orderItemsForCreate = []
    items.forEach(item => {
      const basketItem = basketItems.find(el => el.itemId === item.id)
      orderItemsForCreate.push({
        name: item.name,
        price: item.price,
        image: item.image,
        count: basketItem.count,
        article: item.article,
        orderId: order.id
      })
    })

    const orderItems = await this.orderItemRepository.bulkCreate(orderItemsForCreate)

    return {order, orderItems}
  }

  async getAll() {
    return await this.orderRepository.findAll()
  }

  async getOneById(id: number) {
    return await this.getOrderWithItems({where: {id}})
  }

  async getOneByToken(token: string) {
    return await this.getOrderWithItems({where: {token}})
  }

  async getOrdersByPhone(phone: string) {
    return await this.orderRepository.findAll({where: {phone}})
  }

  async delete(id: number) {
    await this.orderItemRepository.destroy({where: {orderId: id}})
    await this.orderRepository.destroy({where: {id}})
  }

  async createPayment() {

  }

  private async getOrderWithItems(options: any) {
    const order = await this.orderRepository.findOne(options)
    const orderItems = await this.orderItemRepository.findAll({where: {orderId: order.id}})
    return {...order, items: orderItems}
  }
}
