import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmRepository } from '../../share/database/typeorm.repository';
import { ORDER_CONST } from './order.constant';
import { OrderEntity } from './entities/order.entity';

@Injectable()
export class OrderRepository extends TypeOrmRepository<OrderEntity> {
  constructor(
    @Inject(ORDER_CONST.MODEL_PROVIDER)
    orderEntity: Repository<OrderEntity>,
  ) {
    super(orderEntity);
  }
  async searchOrderEx() {
    const result = await this.repository.find({
      loadRelationIds: true,
      where: {
        isBuy: true,
      },
      select: ['createdAt', 'updatedAt', 'id', 'pay', 'user', 'voucher'],
    });
    for (let i = 0; i < result.length; i++) {
      delete result[i].orderDetails;
    }
    return result;
  }
}
