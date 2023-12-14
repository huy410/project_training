import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmRepository } from '../../share/database/typeorm.repository';
import { FlashsaleDetailEntity } from './entities/flashsale-detail.entity';
import { FLASHSALEDETAIL_CONST } from './flashsale-detail.constant';

@Injectable()
export class FlashsaleDetailRepository extends TypeOrmRepository<FlashsaleDetailEntity> {
  constructor(
    @Inject(FLASHSALEDETAIL_CONST.MODEL_PROVIDER)
    flashsaleDetailEntity: Repository<FlashsaleDetailEntity>,
  ) {
    super(flashsaleDetailEntity);
  }
}
