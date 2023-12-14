import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { healthcare } from 'googleapis/build/src/apis/healthcare';
import { ERROR } from '../../share/common/error-code.const';
import { UpdateOrderDto } from '../order/dto/update-order.dto';
import { OrderService } from '../order/order.service';
import { ProductService } from '../product/product.service';
import { VoucherService } from '../voucher/voucher.service';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { OrderDetailRepository } from './order-detail.repository';

@Injectable()
export class OrderDetailService {
  constructor(
    private readonly orderDetailRepository: OrderDetailRepository,
    private readonly productService: ProductService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    private readonly voucherService: VoucherService,
  ) {}

  async create(createOrderDetailDto: CreateOrderDetailDto) {
    const orderDetail = await this.orderDetailRepository.searchOneOrderDetail(createOrderDetailDto);
    // console.log(orderDetail);
    // if (!orderDetail) {
    //   throw new BadRequestException(ERROR.NOTFOUND.MESSAGE);
    // }
    const newOrderDetail = this.orderDetailRepository.create(createOrderDetailDto);
    const priceProduct = await this.productService.getPrice(newOrderDetail.product);
    const quantity = newOrderDetail.quantity;
    const price = priceProduct * quantity;
    const idOrder = newOrderDetail.order;
    const checkOrder = await this.orderDetailRepository.findOneByCondition(idOrder);
    if (!checkOrder) {
      throw new NotFoundException(ERROR.NOTFOUND.MESSAGE);
    }
    if (orderDetail) {
      const idOrderDetail = (await this.orderDetailRepository.searchOneOrderDetail(createOrderDetailDto)).id;
      const newQuantity = (await this.orderDetailRepository.searchOneOrderDetail(createOrderDetailDto)).quantity;
      const newPrice = (await this.orderDetailRepository.searchOneOrderDetail(createOrderDetailDto)).price;
      await this.update(idOrderDetail, {
        ...UpdateOrderDetailDto,
        quantity: quantity + newQuantity,
        price: price + newPrice,
      });
      await this.orderService.updateVoucher(idOrder, { ...UpdateOrderDto });
      return this.findOne(idOrderDetail);
    }
    const createOrderDetail = await this.orderDetailRepository.save({ ...newOrderDetail, price: price });
    await this.orderService.updateVoucher(idOrder, { ...UpdateOrderDto });
    return createOrderDetail;
  }

  findAll() {
    return this.orderDetailRepository.getAll();
  }
  async orderDetailSearchPrice(conditions: unknown) {
    const list = await this.orderDetailRepository.searchOrderDetail(conditions);
    const priceArr = list.map((od) => od.price);
    let price = 0;
    for (let i = 0; i < priceArr.length; i++) {
      price += priceArr[i];
    }
    return price;
  }
  async getPrice(id: number) {
    const productFound = await this.orderDetailRepository.findOneByCondition(id);
    if (!productFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return (await this.orderDetailRepository.findOneByCondition(id)).price;
  }

  async findOne(id: number) {
    const productFound = await this.orderDetailRepository.findOneByCondition(id);
    if (!productFound) {
      throw new BadRequestException(ERROR.NOTFOUND.MESSAGE);
    }
    return this.orderDetailRepository.findOneByCondition(id);
  }

  async update(id: number, updateOrderDetailDto: UpdateOrderDetailDto) {
    const orderDetailFound = await this.orderDetailRepository.findOneByCondition(id);
    if (!orderDetailFound) {
      throw new BadRequestException(ERROR.NOTFOUND.MESSAGE);
    }
    const updateOrderDetail = await this.orderDetailRepository.update(id, updateOrderDetailDto);

    return updateOrderDetail;
  }

  async remove(id: number) {
    const orderDetailFound = await this.orderDetailRepository.findOneByCondition(id);
    if (!orderDetailFound) {
      throw new BadRequestException('Not found');
    }
    const orderId = orderDetailFound.order;
    await this.orderDetailRepository.delete(id);
    await this.orderService.updateVoucher(orderId, UpdateOrderDto);
    return 'Success';
  }
}
