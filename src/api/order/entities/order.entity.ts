import { OrderDetailEntity } from '../../../api/order-detail/entities/order-detail.entity';
import { UserEntity } from '../../../api/user/user.entity';
import { VoucherEntity } from '../../../api/voucher/entities/voucher.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ORDER_CONST } from '../order.constant';
import { BaseEntity } from 'src/share/database/BaseEntity';

@Entity({ name: ORDER_CONST.MODEL_NAME })
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  pay: number;

  @Column({ default: false })
  isBuy: boolean;

  @ManyToOne(() => UserEntity, (user) => user.orders, { eager: true })
  user: UserEntity;

  @OneToMany(() => OrderDetailEntity, (orderDetails) => orderDetails.order, { cascade: true })
  orderDetails: OrderDetailEntity[];

  @ManyToOne(() => VoucherEntity, (voucher) => voucher.orders, { eager: true })
  voucher: VoucherEntity;
}
