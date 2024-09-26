import {
  Column,
  DataType,
  Model,
  Table,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Dialog } from './dialog.model';

interface MessageCreationAttrs {
  text: string;
  type: string;
  dialogId: number;
}

@Table({ tableName: 'message' })
export class Message extends Model<Message, MessageCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number = 0;

  @Column({ type: DataType.STRING, allowNull: false })
  text: string;

  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @BelongsTo(() => Dialog)
  dialog: Dialog;

  @ForeignKey(() => Dialog)
  dialogId: number;
}
