import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { TypeOrmRepository } from '../../share/database/typeorm.repository';
import { BrandEntity } from './entities/brand.entity';
import { BRAND_CONST } from './brand.constant';

@Injectable()
export class BrandRepository extends TypeOrmRepository<BrandEntity> {
  constructor(
    @Inject(BRAND_CONST.MODEL_PROVIDER)
    brandEntity: Repository<BrandEntity>,
  ) {
    super(brandEntity);
  }
}
