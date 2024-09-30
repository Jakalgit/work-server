import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Item } from './item.model';

export interface ItemInfoCreationAttrs {
  text: string,
  itemId: number,
}

@Table({ tableName: 'item_info' })
export class ItemInfo extends Model<ItemInfo, ItemInfoCreationAttrs> {

  @Column({ type: DataType.TEXT, allowNull: false })
  text: string;

  @BelongsTo(() => Item)
  item: Item;

  @ForeignKey(() => Item)
  itemId: number;
}