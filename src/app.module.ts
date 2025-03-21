import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { TagModule } from './tag/tag.module';
import { ImageModule } from './image/image.module';
import { BasketItemModule } from './basket-item/basket-item.module';
import { RepairRequestModule } from './repair-request/repair-request.module';
import { DialogModule } from './dialog/dialog.module';
import { OrderModule } from './order/order.module';
import { FilesModule } from './files/files.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { SequelizeModule } from '@nestjs/sequelize';
import pg from 'pg';
import { User } from './user/user.model';
import { Item } from './item/models/item.model';
import { Tag } from './tag/tag.model';
import { ItemTag } from './intermediate-tables/item-tag.model';
import { Image } from './image/image.model';
import { Order } from './order/models/order.model';
import { OrderItem } from './order/models/order-item.model';
import { RepairRequest } from './repair-request/repair-request.model';
import { Dialog } from './dialog/dialog.model';
import { BasketItem } from './basket-item/basket-item.model';
import { Message } from './dialog/message.model';
import { ItemInfo } from './item/models/info.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', 'static'), // Указываем папку 'static'
      serveRoot: '/static', // Статические файлы будут доступны по пути '/static'
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      dialectModule: pg,
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT || 5432),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        User,
        Item,
        Tag,
        ItemTag,
        Image,
        Order,
        OrderItem,
        RepairRequest,
        Dialog,
        BasketItem,
        Message,
        ItemInfo,
      ],
      autoLoadModels: true,
    }),
    UserModule,
    ItemModule,
    TagModule,
    ImageModule,
    BasketItemModule,
    RepairRequestModule,
    DialogModule,
    OrderModule,
    FilesModule,
  ],
})
export class AppModule {}
