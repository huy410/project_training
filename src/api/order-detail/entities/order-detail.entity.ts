import { OrderEntity } from '../../../api/order/entities/order.entity';
import { ProductEntity } from '../../../api/product/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ORDERDETAIL_CONST } from '../order-detail.constant';
import { BaseEntity } from '../../../share/database/BaseEntity';

@Entity({ name: ORDERDETAIL_CONST.MODEL_NAME })
export class OrderDetailEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  price: number;

  @Column({ default: null })
  quantity: number;

  @ManyToOne(() => OrderEntity, (order) => order.orderDetails, { onDelete: 'CASCADE', eager: true })
  order: number;

  @ManyToOne(() => ProductEntity, (product) => product.orderDetails, {})
  product: number;
}
