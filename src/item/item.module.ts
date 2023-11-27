import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Item} from "./models/item.model";

@Module({
  controllers: [ItemController],
  providers: [ItemService],
  imports: [
    SequelizeModule.forFeature([Item])
  ]
})
export class ItemModule {}
