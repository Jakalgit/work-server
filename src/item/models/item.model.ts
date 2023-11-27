import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany, HasOne,
  Model,
  Table
} from "sequelize-typescript";
import {Tag} from "../../tag/tag.model";
import {ItemTag} from "../../intermediate-tables/item-tag.model";
import {Color} from "../../color/color.model";
import {Image} from "../../image/image.model";
import {BasketItem} from "../../basket-item/basket-item.model";
import {Discount} from "./discount.model";
import {Popular} from "./popular.model";
import {Novelty} from "./novelty.model";

interface ItemCreationAttrs {
  name: string;
  price: number;
  article: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  count: number;
  visibility: boolean;
  colorId: number;
}

@Table({tableName: 'item'})
export class Item extends Model<Item, ItemCreationAttrs> {

  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: false})
  name: string;

  @Column({type: DataType.INTEGER, allowNull: false})
  price: number;

  @Column({type: DataType.STRING,  unique: true, allowNull: false})
  article: string;

  @Column({type: DataType.INTEGER, allowNull: false})
  length: number;

  @Column({type: DataType.INTEGER, allowNull: false})
  width: number;

  @Column({type: DataType.INTEGER, allowNull: false})
  height: number;

  @Column({type: DataType.INTEGER, allowNull: false})
  weight: number;

  @Column({type: DataType.INTEGER, allowNull: false})
  count: number;

  @Column({type: DataType.BOOLEAN, allowNull: false})
  visibility: boolean;

  @BelongsToMany(() => Tag, () => ItemTag)
  tags: Tag[];

  @BelongsTo(() => Color)
  color: Color;

  @ForeignKey(() => Color)
  @Column
  colorId: number;

  @HasMany(() => Image)
  images: Image[];

  @HasMany(() => BasketItem)
  basketItems: BasketItem[];

  @HasOne(() => Discount)
  discount: Discount

  @HasOne(() => Popular)
  popular: Discount

  @HasOne(() => Novelty)
  novelty: Discount
}