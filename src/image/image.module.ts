import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import {FilesModule} from "../files/files.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {Image} from "./image.model";

@Module({
  providers: [ImageService],
  imports: [
    FilesModule,
    SequelizeModule.forFeature([Image])
  ],
  exports: [ImageService]
})
export class ImageModule {}
