import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmRepository } from '../../share/database/typeorm.repository';
import { ORDERDETAIL_CONST } from './order-detail.constant';
import { OrderDetailEntity } from './entities/order-detail.entity';

@Injectable()
export class OrderDetailRepository extends TypeOrmRepository<OrderDetailEntity> {
  constructor(
    @Inject(ORDERDETAIL_CONST.MODEL_PROVIDER)
    orderDetailEntity: Repository<OrderDetailEntity>,
  ) {
    super(orderDetailEntity);
  }
}
