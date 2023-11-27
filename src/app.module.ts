import {Module} from '@nestjs/common';
import {UserModule} from './user/user.module';
import { ItemModule } from './item/item.module';
import { TagModule } from './tag/tag.module';
import { ColorModule } from './color/color.module';
import { ImageModule } from './image/image.module';
import { BasketItemModule } from './basket-item/basket-item.module';
import { RepairRequestModule } from './repair-request/repair-request.module';
import { DialogModule } from './dialog/dialog.module';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [UserModule, ItemModule, TagModule, ColorModule, ImageModule, BasketItemModule, RepairRequestModule, DialogModule, OrderModule, OrderItemModule, FilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
