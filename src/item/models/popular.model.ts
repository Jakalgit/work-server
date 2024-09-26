import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Item } from './item.model';

interface PopularCreationAttrs {
  itemId: number;
}

@Table({ tableName: 'popular' })
export class Popular extends Model<Popular, PopularCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number = 0;

  @BelongsTo(() => Item)
  item: Item;

  @ForeignKey(() => Item)
  @Column
  itemId: number;
}
