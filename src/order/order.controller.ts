import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/')
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Get('/all')
  getAll() {
    return this.orderService.getAll();
  }

  @Get('/by-id/:id')
  getOrderById(@Param('id') id: number) {
    return this.orderService.getOneById(id);
  }

  @Get('/by-token/:token')
  getOrderByToken(@Param('token') token: string) {
    return this.orderService.getOneByToken(token);
  }

  @Get('/by-phone/:phone')
  getOrdersByPhone(@Param('phone') phone: string) {
    return this.orderService.getOrdersByPhone(phone);
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.orderService.delete(id);
  }
}
