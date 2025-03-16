import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Item} from "./models/item.model";
import {ItemTag} from "../intermediate-tables/item-tag.model";
import {Tag} from "../tag/tag.model";
import {ImageModule} from "../image/image.module";
import { ItemInfo } from './models/info.model';

@Module({
  controllers: [ItemController],
  providers: [ItemService],
  imports: [
    SequelizeModule.forFeature([Item, ItemTag, ItemInfo, Tag]),
    ImageModule
  ],
  exports: [ItemService]
})
export class ItemModule {}
