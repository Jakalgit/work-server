import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Order} from "./models/order.model";
import {Item} from "../item/models/item.model";
import {BasketItem} from "../basket-item/basket-item.model";
import {OrderItem} from "./models/order-item.model";

@Module({
  providers: [OrderService],
  controllers: [OrderController],
  imports: [
    SequelizeModule.forFeature([Order, Item, BasketItem, OrderItem])
  ]
})
export class OrderModule {}
