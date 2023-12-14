import { BrandEntity } from '../../../api/brand/entities/brand.entity';
import { CategoryEntity } from '../../../api/category/entities/category.entity';
import { FlashsaleDetailEntity } from '../../../api/flashsale-detail/entities/flashsale-detail.entity';
import { OrderDetailEntity } from '../../../api/order-detail/entities/order-detail.entity';
import { OrderEntity } from '../../../api/order/entities/order.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PRODUCT_CONST } from '../product.constant';
import { BaseEntity } from '../../../share/database/BaseEntity';

@Entity({ name: PRODUCT_CONST.MODEL_NAME })
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('name')
  @Column({ length: 255, default: null })
  name: string;

  @Column({ length: 255, default: null })
  describe: string;

  @Column({ default: null })
  priceOrigin: number;

  @Column({ default: null })
  price: number;

  @Column({ default: null })
  quantity: number;

  @Column({ length: 255, default: null })
  image: string;

  @ManyToOne(() => BrandEntity, (brand) => brand.products, {
    onDelete: 'SET NULL',
    eager: true,
  })
  brand: BrandEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    eager: true,
  })
  category: CategoryEntity;

  @OneToMany(() => OrderDetailEntity, (orderDetails) => orderDetails.product)
  orderDetails: OrderEntity[];

  @ManyToOne(() => FlashsaleDetailEntity, (flashsaleDetail) => flashsaleDetail.products, {
    eager: true,
  })
  flashsaleDetail: FlashsaleDetailEntity;
}
