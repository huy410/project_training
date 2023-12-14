import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { TypeOrmRepository } from '../../share/database/typeorm.repository';
import { CATEGORY_CONST } from './category.constant';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryRepository extends TypeOrmRepository<CategoryEntity> {
  constructor(
    @Inject(CATEGORY_CONST.MODEL_PROVIDER)
    categoryEntity: Repository<CategoryEntity>,
  ) {
    super(categoryEntity);
  }
}
