import { Module } from '@nestjs/common';
import { BasketItemController } from './basket-item.controller';
import { BasketItemService } from './basket-item.service';

@Module({
  controllers: [BasketItemController],
  providers: [BasketItemService]
})
export class BasketItemModule {}
