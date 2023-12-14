import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { DatabaseModule } from '../../configs/database/database.module';
import { MulterModule } from '@nestjs/platform-express';
import { BrandRepository } from './brand.repository';
import { brandProvider } from './brand.provider';

@Module({
  imports: [DatabaseModule, MulterModule.register({ dest: './uploads' })],
  controllers: [BrandController],
  providers: [BrandService, BrandRepository, ...brandProvider],
  exports: [BrandService, BrandRepository],
})
export class BrandModule {}
