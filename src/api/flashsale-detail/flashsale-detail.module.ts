import { forwardRef, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseModule } from '../../configs/database/database.module';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { FlashsaleDetailController } from './flashsale-detail.controller';
import { flashsaleDetailProvider } from './flashsale-detail.provider';
import { FlashsaleDetailRepository } from './flashsale-detail.repository';
import { FlashsaleDetailService } from './flashsale-detail.service';

@Module({
  imports: [DatabaseModule, MulterModule.register({ dest: './uploads' }), forwardRef(() => ProductModule), UserModule],
  controllers: [FlashsaleDetailController],
  providers: [FlashsaleDetailService, FlashsaleDetailRepository, ...flashsaleDetailProvider],
  exports: [FlashsaleDetailService, FlashsaleDetailRepository],
})
export class FlashsaleDetailModule {}
