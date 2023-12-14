import { Module } from '@nestjs/common';
import { DeService } from './de.service';
import { DeController } from './de.controller';

@Module({
  controllers: [DeController],
  providers: [DeService]
})
export class DeModule {}
