import {Column, Table, Model, DataType, HasOne} from "sequelize-typescript";
import {Dialog} from "../dialog/dialog.model";

interface UserCreationAttrs {
  token: string;
}

@Table({tableName: 'user'})
export class User extends Model<User, UserCreationAttrs> {

  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;

  @Column({type: DataType.STRING, unique: true, allowNull: false})
  token: string;

  @HasOne(() => Dialog)
  dialog: Dialog;

}