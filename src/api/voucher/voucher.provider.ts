import { Connection } from 'typeorm';
import { VoucherEntity } from './entities/voucher.entity';
import { VOUCHER_CONST } from './voucher.constant';
export const voucherProvider = [
  {
    provide: VOUCHER_CONST.MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.getRepository(VoucherEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
