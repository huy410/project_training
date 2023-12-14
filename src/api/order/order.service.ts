import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { ERROR } from '../../share/common/error-code.const';
import { OrderDetailService } from '../order-detail/order-detail.service';
import { UpdateVoucherDto } from '../voucher/dto/update-voucher.dto';
import { VoucherService } from '../voucher/voucher.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderEntity } from './entities/order.entity';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    @Inject(forwardRef(() => OrderDetailService))
    private readonly orderDetailService: OrderDetailService,
    @Inject(forwardRef(() => VoucherService))
    private readonly voucherService: VoucherService,
  ) {}
  async create(data: CreateOrderDto, id: any): Promise<OrderEntity> {
    const newOrder = this.orderRepository.create({ ...data, user: id });
    const createOrder = await this.orderRepository.save(newOrder);
    if (!newOrder) {
      throw new BadRequestException(ERROR.USER_EXISTED.MESSAGE);
    }
    return createOrder;
  }
  async acceptOrder(id: number, userId: any) {
    const order = this.findOne(id);
    const voucherId = (await order).voucher;

    const userIdFromOrder = (await order).user.id;
    if (userId === userIdFromOrder && (await order).isBuy === false) {
      (await order).isBuy = true;
      await (await order).save();
      if (voucherId != null) {
        const quantity = (await this.voucherService.getQuantity((await order).voucher)) - 1;
        if (quantity === -1) throw new BadRequestException(ERROR.VOUCHER_EXPIRED.MESSAGE);
        await this.voucherService.update(voucherId.id, { ...UpdateVoucherDto, quantity: quantity });
      }
    }
    return this.findOne(id);
  }

  findAll(): Promise<OrderEntity> {
    return this.orderRepository.getAll();
  }

  async findOne(id: number) {
    const orderFound = await this.orderRepository.findOneByCondition(id);
    if (!orderFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return this.orderRepository.findOneByCondition(id);
  }

  async updateVoucher(id: any, body: UpdateVoucherDto) {
    const orderFound = await this.orderRepository.findOneByCondition(id);
    if (!orderFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    let pay = await this.orderDetailService.orderDetailSearchPrice({ order: id });
    const discount = await this.voucherService.getDiscount(orderFound.voucher);
    if (orderFound.voucher !== null) {
      pay = pay - (pay * discount) / 100;
      await this.orderRepository.update(orderFound.id, { ...body, pay });

      return this.orderRepository.findOneByCondition({ id: orderFound.id });
    }

    await this.orderRepository.update(orderFound.id, { ...body, pay });

    return this.orderRepository.findOneByCondition({ id: orderFound.id });
  }

  async remove(id: number) {
    const orderFound = await this.orderRepository.findOneByCondition(id);
    if (!orderFound) {
      throw new BadRequestException(ERROR.NOTFOUND.MESSAGE);
    }
    if (orderFound.isBuy === true) {
      return {
        statusCode: 400,
        message: 'Not delete order was active',
      };
    }
    await this.orderRepository.delete(id);
    return {
      message: 'success',
    };
  }
  async exportOrder() {
    const order = await this.orderRepository.searchOrderEx();

    return order;
  }
}
