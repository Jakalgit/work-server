import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ChangeItemDto } from './dto/change-item.dto';
import { GetItemFilterDto } from './dto/get-item-filter.dto';

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Post('/')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images' }]))
  create(@Body() dto: CreateItemDto, @UploadedFiles() files) {
    const { images } = files;
    return this.itemService.create(dto, images);
  }

  @Put('/change/item')
  changeItem(@Body() dto: ChangeItemDto) {
    return this.itemService.changeItem(dto);
  }

  @Put('/change/image')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image' }]))
  changeImage(@Body() imageId: number, @UploadedFiles() files: any) {
    const { image } = files;
    return this.itemService.changeImage(imageId, image[0]);
  }

  @Delete('/image/:id')
  deleteImage(@Param('id') imageId: number) {
    return this.itemService.deleteImage(imageId);
  }

  @Get('/one/:id')
  getOne(@Param('id') id: number) {
    return this.itemService.getOne(id);
  }

  @Get('/all-items')
  getAll() {
    return this.itemService.getAll();
  }

  @Post('/by-filter')
  getAllByFilterPage(@Body() dto: GetItemFilterDto) {
    return this.itemService.getAllByFilterPage(dto);
  }

  @Get('/prices')
  getPrices() {
    return this.itemService.getPrices();
  }
}
