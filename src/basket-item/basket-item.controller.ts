import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {BasketItemService} from "./basket-item.service";
import {CreateBasketItemDto} from "./dto/create-basket-item.dto";

@Controller('basket-item')
export class BasketItemController {

  constructor(private basketItemService: BasketItemService) {
  }

  @Post('/')
  create(@Body() dto: CreateBasketItemDto) {
    return this.basketItemService.create(dto)
  }

  @Put('/increment/:id')
  increment(@Param('id') id: number) {
    return this.basketItemService.incrementCount(id)
  }

  @Put('/decrement/:id')
  decrement(@Param('id') id: number) {
    return this.basketItemService.decrementCount(id)
  }

  @Get('/:id')
  getAllByUserId(@Param('id') userId: number) {
    return this.basketItemService.getAllByUserId(userId)
  }

  @Delete('/item/:id')
  deleteById(@Param('id') id: number) {
    return this.basketItemService.deleteById(id)
  }

  @Delete('/basket/:id')
  deleteAllByUserId(@Param('id') userId: number) {
    return this.basketItemService.deleteAllByUserId(userId)
  }

}
