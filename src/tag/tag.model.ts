import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Item } from '../item/models/item.model';
import { ItemTag } from '../intermediate-tables/item-tag.model';

interface TagCreationAttrs {
  name: string;
}

@Table({ tableName: 'tag' })
export class Tag extends Model<Tag, TagCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number = 0;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @BelongsToMany(() => Item, () => ItemTag)
  items: Item[];
}
