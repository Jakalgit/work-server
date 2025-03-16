import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Tag } from '../../tag/tag.model';
import { ItemTag } from '../../intermediate-tables/item-tag.model';
import { Image } from '../../image/image.model';
import { BasketItem } from '../../basket-item/basket-item.model';
import { ItemInfo } from './info.model';

export interface ItemCreationAttrs {
  name: string;
  price: number;
  article: string;
  count: number;
  visibility: boolean;
  availability: boolean;
}

@Table({ tableName: 'item' })
export class Item extends Model<Item, ItemCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number = 0;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  price: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  article: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  count: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  visibility: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  availability: boolean;

  @BelongsToMany(() => Tag, () => ItemTag)
  tags: Tag[];

  @HasMany(() => Image)
  images: Image[];

  @HasMany(() => BasketItem)
  basketItems: BasketItem[];

  @HasMany(() => ItemInfo)
  itemInfos: ItemInfo[];
}
