import { OrderEntity } from '../../../api/order/entities/order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { VOUCHER_CONST } from '../voucher.constant';
import { BaseEntity } from '../../../share/database/BaseEntity';

@Entity({ name: VOUCHER_CONST.MODEL_NAME })
export class VoucherEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, default: null })
  name: string;

  @Column({ default: 0 })
  discount: number;

  @Column({ default: null })
  quantity: number;

  @OneToMany(() => OrderEntity, (order) => order.voucher)
  orders: OrderEntity[];
}
