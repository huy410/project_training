import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { DatabaseModule } from '../../configs/database/database.module';
import { MulterModule } from '@nestjs/platform-express';
import { CategoryRepository } from './category.repository';
import { categoryProvider } from './category.provider';

@Module({
  imports: [DatabaseModule, MulterModule.register({ dest: './uploads' })],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, ...categoryProvider],
  exports: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
