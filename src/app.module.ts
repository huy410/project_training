import { CacheModule, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './share/auth/auth.module';
import { LoggerMiddleware } from './share/middlewares/logger.middleware';
import { ProductModule } from './api/product/product.module';
import { CategoryModule } from './api/category/category.module';
import { BrandModule } from './api/brand/brand.module';
import { OrderModule } from './api/order/order.module';
import { FeedbackModule } from './api/feedback/feedback.module';
import { VoucherModule } from './api/voucher/voucher.module';
import { OrderDetailModule } from './api/order-detail/order-detail.module';
import { FlashsaleDetailModule } from './api/flashsale-detail/flashsale-detail.module';
import * as redisStore from 'cache-manager-redis-store';
import { SmsModule } from './share/services/sms/sms.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({ store: redisStore, host: 'localhost', port: 6379 }),
    UserModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    BrandModule,
    OrderModule,
    FeedbackModule,
    VoucherModule,
    OrderDetailModule,
    FlashsaleDetailModule,
    SmsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
