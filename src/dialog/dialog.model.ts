import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {User} from "../user/user.model";
import {Message} from "./message.model";

interface DialogCreationAttrs {
  userToken: string;
  name: string;
  lastAdminCheck: string;
}

@Table({tableName: 'dialog'})
export class Dialog extends Model<Dialog, DialogCreationAttrs> {

  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: false})
  name: string;

  @Column({type: DataType.STRING, allowNull: false, defaultValue: Date.now().toString()})
  lastAdminCheck: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  @Column
  userToken: string;

  @HasMany(() => Message)
  messages: Message[];

}