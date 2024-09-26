import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Item } from '../item/models/item.model';
import { User } from '../user/user.model';

interface BasketItemCreationAttrs {
  itemId: number;
  count: number;
  userId: number;
}

@Table({ tableName: 'basket-item' })
export class BasketItem extends Model<BasketItem, BasketItemCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number = 0;

  @Column({ type: DataType.INTEGER, allowNull: false })
  count: number;

  @BelongsTo(() => Item)
  item: Item;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Item)
  @Column
  itemId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;
}
