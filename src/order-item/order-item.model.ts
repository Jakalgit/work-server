import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Order} from "../order/order.model";
import {Image} from "../image/image.model";

interface OrderItemCreationAttrs {
  name: string;
  price: number;
  image: string;
  count: number;
  article: string;
  orderId: number;
}

@Table({tableName: 'order-item'})
export class OrderItem extends Model<OrderItem, OrderItemCreationAttrs> {

  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: false})
  name: string;

  @Column({type: DataType.INTEGER, allowNull: false})
  price: number;

  @Column({type: DataType.STRING, allowNull: false})
  image: string;

  @Column({type: DataType.INTEGER, allowNull: false})
  count: number;

  @Column({type: DataType.STRING, allowNull: false})
  article: string;

  @BelongsTo(() => Order)
  order: Order;

  @ForeignKey(() => Order)
  orderId: number;

}