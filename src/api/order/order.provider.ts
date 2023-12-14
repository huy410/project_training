import { Connection } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { ORDER_CONST } from './order.constant';

export const orderProvider = [
  {
    provide: ORDER_CONST.MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.getRepository(OrderEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
