import { Connection } from 'typeorm';
import { OrderDetailEntity } from './entities/order-detail.entity';
import { ORDERDETAIL_CONST } from './order-detail.constant';

export const orderDetailProvider = [
  {
    provide: ORDERDETAIL_CONST.MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.getRepository(OrderDetailEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
