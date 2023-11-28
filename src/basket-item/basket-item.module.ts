import { Module } from '@nestjs/common';
import { BasketItemController } from './basket-item.controller';
import { BasketItemService } from './basket-item.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Item} from "../item/models/item.model";
import {ItemModule} from "../item/item.module";

@Module({
  controllers: [BasketItemController],
  providers: [BasketItemService],
  imports: [
    SequelizeModule.forFeature([Item, BasketItemService]),
    ItemModule,
  ]
})
export class BasketItemModule {}
