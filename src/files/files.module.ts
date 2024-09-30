import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from '../order/models/order.model';
import { Item } from '../item/models/item.model';
import { BasketItem } from '../basket-item/basket-item.model';
import { OrderItem } from '../order/models/order-item.model';

@Module({
  providers: [FilesService],
  exports: [FilesService],
  imports: [
    SequelizeModule.forFeature([OrderItem]),
  ]
})
export class FilesModule {}
