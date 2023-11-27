import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Item} from "./item.model";

interface DiscountCreationAttrs {
  old_price: number;
  itemId: number;
}

@Table({tableName: 'discount'})
export class Discount extends Model<Discount, DiscountCreationAttrs> {

  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;

  @Column({type: DataType.INTEGER, allowNull: false})
  old_price: number;

  @BelongsTo(() => Item)
  item: Item;

  @ForeignKey(() => Item)
  @Column
  itemId: number;
}