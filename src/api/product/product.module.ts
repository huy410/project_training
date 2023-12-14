import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseModule } from '../../configs/database/database.module';
import { MulterModule } from '@nestjs/platform-express';
import { ProductRepository } from './product.repository';
import { productProvider } from './product.provider';
import { FlashsaleDetailModule } from '../flashsale-detail/flashsale-detail.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),

    ScheduleModule.forRoot(),
    DatabaseModule,
    MulterModule.register({ dest: './uploads' }),
    forwardRef(() => FlashsaleDetailModule),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, ...productProvider],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}
