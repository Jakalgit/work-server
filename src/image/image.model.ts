import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Item} from "../item/models/item.model";

interface ImageCreationAttrs {
  index: number;
  filename: string;
  itemId: number;
}

@Table({tableName: 'image'})
export class Image extends Model<Image, ImageCreationAttrs> {

  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;

  @Column({type: DataType.INTEGER, allowNull: false})
  index: number;

  @Column({type: DataType.STRING, allowNull: false})
  filename: string;

  @BelongsTo(() => Item)
  item: Item;

  @ForeignKey(() => Item)
  @Column
  itemId: number;

}