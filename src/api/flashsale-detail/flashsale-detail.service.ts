import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { ERROR } from '../../share/common/error-code.const';
import { UpdateProductDto } from '../product/dto/update-product.dto';
import { ProductRepository } from '../product/product.repository';
import { ProductService } from '../product/product.service';
import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';
import { CreateFlashsaleDetailDto } from './dto/create-flashsale-detail.dto';
import { UpdateFlashsaleDetailDto } from './dto/update-flashsale-detail.dto';
import { FlashsaleDetailRepository } from './flashsale-detail.repository';

@Injectable()
export class FlashsaleDetailService {
  constructor(
    private readonly flashsaleDetailRepository: FlashsaleDetailRepository,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
    private mailService: MailerService,
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductRepository,
  ) {}
  async create(createFlashsaleDetailDto: CreateFlashsaleDetailDto) {
    const newFlashsaleDetail = this.flashsaleDetailRepository.create(createFlashsaleDetailDto);
    if (!newFlashsaleDetail) {
      throw new BadRequestException(ERROR.USER_EXISTED.MESSAGE);
    }
    const createFlashsaleDetail = await this.flashsaleDetailRepository.save(newFlashsaleDetail);
    return createFlashsaleDetail;
  }

  async getFlashsale(id: any) {
    const flashsaleFound = this.flashsaleDetailRepository.findOneByCondition(id);
    if (!flashsaleFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return (await flashsaleFound).discount;
  }
  async getOne(id: any) {
    const flashsaleFound = await this.flashsaleDetailRepository.findOneByCondition(id);
    if (!flashsaleFound) {
      throw new BadRequestException(ERROR.NOTFOUND.MESSAGE);
    }
    return flashsaleFound;
  }
  async findAll() {
    return this.flashsaleDetailRepository.getAll();
    // const discount = a.map((od: any) => od.discount);
  }
  // start flashsale
  @Interval(1000 * 60 * 5)
  async startFlashsale() {
    const dateNow = new Date();
    const flashsale = await this.flashsaleDetailRepository.getAll();
    const product = await this.productRepository.getAll();
    const productId = product.map((product) => product.id);
    const dateStart = flashsale.map((od: any) => od.timeStart);
    for (let i = 0; i < dateStart.length; i++) {
      if (dateStart[i] === dateNow) {
        for (let j = 0; j < productId.length; j++) {
          this.productService.updatePrice(productId[j], UpdateProductDto);
        }
      }
    }
  }
  // end flashsale
  @Interval(1000 * 60 * 5)
  async endFlashsale() {
    const dateNow = new Date();
    const flashsale = await this.flashsaleDetailRepository.getAll();
    const product = await this.productRepository.getAll();
    const productId = product.map((product) => product.id);

    const dateEnd = flashsale.map((fl: any) => fl.timeEnd);
    for (let i = 0; i < dateEnd.length; i++) {
      if (dateNow === dateEnd[i]) {
        for (let j = 0; j < productId.length; j++) {
          this.productService.updateOriginPrice(productId[j], UpdateProductDto);
        }
      }
    }
  }
  // send Email notification
  @Interval(1000 * 60 * 5)
  async sendNotify() {
    const dateNow = new Date();
    const flashsale = await this.flashsaleDetailRepository.getAll();
    const dateNotify = flashsale.map((od: any) => od.timeNotify);
    for (let i = 0; i < dateNotify.length; i++) {
      if (dateNotify[i] === dateNow) {
        this.sendEmail();
      }
    }
    // console.log(dateStart, date, dateEnd, dateNotify);
  }

  // @Interval(1000 * 30)
  async sendEmail() {
    const user = await this.userRepository.getAll();
    const email = user.map((us: any) => us.email);
    for (let i = 0; i < email.length; i++) {
      await this.mailService.sendMail({
        to: email[i],
        from: 'hungboxi12223@gmail.com',
        subject: 'Plain Text Email ✔',
        html: `Flashsale sắp bắt đầu`,
      });
    }
    // console.log(email);
  }

  async findOne(id: number) {
    const productFound = await this.flashsaleDetailRepository.findOneByCondition(id);
    if (!productFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return this.flashsaleDetailRepository.findOneByCondition(id);
  }

  async update(id: number, updateFlashsaleDetailDto: UpdateFlashsaleDetailDto) {
    const userFound = await this.flashsaleDetailRepository.findOneByCondition(id);
    if (!userFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    await this.flashsaleDetailRepository.update(userFound.id, updateFlashsaleDetailDto);
    const product = await this.productService.productSearchByFlashsaleDetail({ flashsaleDetail: id });
    const productId = product.map((product) => product.id);
    for (let i = 0; i < productId.length; i++) {
      await this.productService.updatePrice(productId[i], UpdateProductDto);
    }
    return this.flashsaleDetailRepository.findOneByCondition({ id: userFound.id });
  }

  async remove(id: number) {
    const flashsaleDetailFound = await this.flashsaleDetailRepository.findOneByCondition(id);
    const productId = flashsaleDetailFound.products;
    if (!flashsaleDetailFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    await this.flashsaleDetailRepository.delete(id);
    await this.productService.updateOriginPrice(productId, UpdateProductDto);
    return 'Success!';
  }
}
