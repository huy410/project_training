import { BadRequestException, Injectable } from '@nestjs/common';
import { ERROR } from '../../share/common/error-code.const';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { VoucherRepository } from './voucher.repository';

@Injectable()
export class VoucherService {
  constructor(private readonly voucherRepository: VoucherRepository) {}
  async create(createVoucherDto: CreateVoucherDto) {
    const newVoucher = this.voucherRepository.create(createVoucherDto);
    if (!newVoucher) {
      throw new BadRequestException(ERROR.USER_EXISTED.MESSAGE);
    }
    const createVoucher = await this.voucherRepository.save(newVoucher);
    return createVoucher;
  }

  findAll() {
    return this.voucherRepository.getAll();
  }

  async findOne(id: number) {
    const categoryFound = await this.voucherRepository.findOneByCondition(id);
    if (!categoryFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return this.voucherRepository.findOneByCondition(id);
  }

  async getDiscount(id: unknown) {
    const discountFound = await this.voucherRepository.findOneByCondition(id);
    if (!discountFound) {
      return null;
    }
    return (await this.voucherRepository.findOneByCondition(id)).discount;
  }
  async getQuantity(id: unknown) {
    const discountFound = await this.voucherRepository.findOneByCondition(id);
    if (!discountFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return (await this.voucherRepository.findOneByCondition(id)).quantity;
  }

  async update(id: number, updateVoucherDto: UpdateVoucherDto) {
    const voucherFound = await this.voucherRepository.findOneByCondition(id);
    if (!voucherFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    await this.voucherRepository.update(voucherFound.id, updateVoucherDto);

    return this.voucherRepository.findOneByCondition(id);
  }

  async remove(id: number) {
    const voucherFound = await this.voucherRepository.findOneByCondition(id);
    if (!voucherFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    await this.voucherRepository.delete(id);
    return 'Success!';
  }
}
