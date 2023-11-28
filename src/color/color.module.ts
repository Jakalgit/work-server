import { Module } from '@nestjs/common';
import { ColorService } from './color.service';
import { ColorController } from './color.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Item} from "../item/models/item.model";
import {Color} from "./color.model";

@Module({
  providers: [ColorService],
  controllers: [ColorController],
  imports: [
    SequelizeModule.forFeature([Item, Color])
  ]
})
export class ColorModule {}
