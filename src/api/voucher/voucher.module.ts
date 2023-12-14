import { forwardRef, Module } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';
import { DatabaseModule } from '../../configs/database/database.module';
import { MulterModule } from '@nestjs/platform-express';
import { VoucherRepository } from './voucher.repository';
import { voucherProvider } from './voucher.provider';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [DatabaseModule, MulterModule.register({ dest: './uploads' }), forwardRef(() => OrderModule)],
  controllers: [VoucherController],
  providers: [VoucherService, VoucherRepository, ...voucherProvider],
  exports: [VoucherService, VoucherRepository],
})
export class VoucherModule {}
