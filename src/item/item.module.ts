import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Item} from "./models/item.model";
import {ItemTag} from "../intermediate-tables/item-tag.model";
import {Tag} from "../tag/tag.model";
import {Color} from "../color/color.model";
import {Discount} from "./models/discount.model";
import {Novelty} from "./models/novelty.model";
import {Popular} from "./models/popular.model";
import {ImageModule} from "../image/image.module";

@Module({
  controllers: [ItemController],
  providers: [ItemService],
  imports: [
    SequelizeModule.forFeature([Item, ItemTag, Tag, Color, Discount, Novelty, Popular]),
    ImageModule
  ],
  exports: [ItemService]
})
export class ItemModule {}
