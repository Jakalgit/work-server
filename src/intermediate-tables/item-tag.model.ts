import {Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {Item} from "../item/models/item.model";
import {Tag} from "../tag/tag.model";

interface ItemTagCreationAttrs {
  itemId: number;
  tagId: number;
}

@Table({ tableName: 'item-tag', createdAt: false, updatedAt: false })
export class ItemTag extends Model<ItemTag, ItemTagCreationAttrs> {

  @ForeignKey(() => Item)
  @Column
  itemId: number;

  @ForeignKey(() => Tag)
  @Column
  tagId: number;

}