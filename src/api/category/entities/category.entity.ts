import { ProductEntity } from '../../../api/product/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CATEGORY_CONST } from '../category.constant';
import { BaseEntity } from '../../../share/database/BaseEntity';

@Entity({ name: CATEGORY_CONST.MODEL_NAME })
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  name: string;

  @Column({ length: 255, default: null })
  describe: string;

  @Column({ default: null })
  active: boolean;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];
}
