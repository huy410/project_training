import { Connection } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { PRODUCT_CONST } from './product.constant';

export const productProvider = [
  {
    provide: PRODUCT_CONST.MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.getRepository(ProductEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
