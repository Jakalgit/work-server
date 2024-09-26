import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { OrderItem } from './order-item.model';

interface OrderCreationAttrs {
  token: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  date: number;
  price: number;
  typePay: number;
  typeDelivery: number;
}

@Table({ tableName: 'order' })
export class Order extends Model<Order, OrderCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number = 0;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  token: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  phone: string;

  @Column({ type: DataType.STRING })
  email: string;

  @Column({ type: DataType.STRING })
  address: string;

  // @Column({type: DataType.INTEGER, allowNull: false})
  // track: number;

  @Column({ type: DataType.BIGINT, allowNull: false, defaultValue: Date.now() })
  date: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  typePay: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  typeDelivery: number;

  @HasMany(() => OrderItem)
  orderItems: OrderItem[];
}
