import { Connection } from 'typeorm';
import { CATEGORY_CONST } from './category.constant';
import { CategoryEntity } from './entities/category.entity';

export const categoryProvider = [
  {
    provide: CATEGORY_CONST.MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.getRepository(CategoryEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
