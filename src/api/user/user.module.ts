import { CacheModule, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { DatabaseModule } from '../../configs/database/database.module';
import { userProvider } from './user.provider';
import { UserController } from './user.controller';
import { MulterModule } from '@nestjs/platform-express';
import { SmsModule } from 'src/share/services/sms/sms.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    DatabaseModule,
    MulterModule.register({ dest: './uploads' }),
    SmsModule,
    CacheModule.register({ store: redisStore, host: 'localhost', port: 6379 }),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, ...userProvider],
  exports: [UserService, UserRepository],
})
export class UserModule {}
