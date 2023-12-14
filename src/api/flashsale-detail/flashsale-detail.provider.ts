import { Connection } from 'typeorm';
import { FlashsaleDetailEntity } from './entities/flashsale-detail.entity';
import { FLASHSALEDETAIL_CONST } from './flashsale-detail.constant';

export const flashsaleDetailProvider = [
  {
    provide: FLASHSALEDETAIL_CONST.MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.getRepository(FlashsaleDetailEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
