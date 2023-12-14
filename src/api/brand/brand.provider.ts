import { Connection } from 'typeorm';
import { BRAND_CONST } from './brand.constant';
import { BrandEntity } from './entities/brand.entity';

export const brandProvider = [
  {
    provide: BRAND_CONST.MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.getRepository(BrandEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
