import {Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseInterceptors} from '@nestjs/common';
import {ItemService} from "./item.service";
import {CreateItemDto} from "./dto/create-item.dto";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {ChangeItemDto} from "./dto/change-item.dto";
import {GetItemFilterDto} from "./dto/get-item-filter.dto";

@Controller('item')
export class ItemController {

  constructor(private itemService: ItemService) {
  }

  @Post('/')
  @UseInterceptors(FileFieldsInterceptor([
    { name: "images" },
  ]))
  create(@Body() dto: CreateItemDto, @UploadedFiles() files) {
    const {images} = files
    return this.itemService.create(dto, images)
  }

  @Post('/add-discount')
  addDiscount(@Body() id: number, @Body() price: number) {
    return this.itemService.addDiscount(id, price)
  }

  @Post('/add-novelty')
  addToNovelty(@Body() id: number) {
    return this.itemService.addToNovelty(id)
  }

  @Post('/add-popular')
  addToPopular(@Body() id: number) {
    return this.itemService.addToPopular(id)
  }

  @Put('/change/item')
  changeItem(@Body() dto: ChangeItemDto) {
    return this.itemService.changeItem(dto)
  }

  @Put('/change/image')
  @UseInterceptors(FileFieldsInterceptor([
    { name: "image" },
  ]))
  changeImage(@Body() imageId: number, @UploadedFiles() files) {
    const {image} = files
    return this.itemService.changeImage(imageId, image[0])
  }

  @Delete('/image/:id')
  deleteImage(@Param('id') imageId: number) {
    return this.itemService.deleteImage(imageId)
  }

  @Delete('/discount/:id')
  deleteDiscount(@Param('id') id: number) {
    return this.itemService.deleteDiscount(id)
  }

  @Delete('/novelty/:id')
  deleteNovelty(@Param('id') id: number) {
    return this.itemService.deleteFromNovelty(id)
  }

  @Delete('/popular/:id')
  deleteFromPopular(@Param('id') id: number) {
    return this.itemService.deleteFromPopular(id)
  }

  @Get('/:id')
  getOne(@Param('id') id: number) {
    return this.itemService.getOne(id)
  }

  @Get('/all')
  getAll() {
    return this.itemService.getAll()
  }

  @Post('/by-filter')
  getAllByFilterPage(@Body() dto: GetItemFilterDto) {
    return this.itemService.getAllByFilterPage(dto)
  }

  @Get('/prices')
  getPrices() {
    return this.itemService.getPrices()
  }
}
