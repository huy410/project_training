import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmRepository } from '../../share/database/typeorm.repository';
import { ProductEntity } from './entities/product.entity';
import { PRODUCT_CONST } from './product.constant';

@Injectable()
export class ProductRepository extends TypeOrmRepository<ProductEntity> {
  constructor(
    @Inject(PRODUCT_CONST.MODEL_PROVIDER)
    productEntity: Repository<ProductEntity>,
  ) {
    super(productEntity);
  }
}
