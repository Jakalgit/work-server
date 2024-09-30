import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface RepairRequestCreationAttrs {
  name: string;
  phone: number;
  message: string;
  response: boolean;
}

@Table({ tableName: 'repair-request' })
export class RepairRequest extends Model<
  RepairRequest,
  RepairRequestCreationAttrs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number = 0;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  phone: number;

  @Column({ type: DataType.STRING, allowNull: false })
  message: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  response: boolean;
}
