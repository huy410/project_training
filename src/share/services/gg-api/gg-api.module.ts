import { Module } from '@nestjs/common';
import { GoogleApiService } from './gg-api.service';

@Module({
  providers: [GoogleApiService],
  exports: [GoogleApiService],
})
export class GoogleApiModule {}
