import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {Item} from "../item/models/item.model";

interface ColorCreationAttrs {
  name: string;
}

@Table({tableName: 'color'})
export class Color extends Model<Color, ColorCreationAttrs> {

  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: false})
  name: string;

  @HasMany(() => Item)
  items: Item[]

}