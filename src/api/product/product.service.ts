import { BadRequestException, forwardRef, Inject, Injectable, UploadedFile } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ERROR } from '../../share/common/error-code.const';
import { FlashsaleDetailService } from '../flashsale-detail/flashsale-detail.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    @Inject(forwardRef(() => FlashsaleDetailService))
    private readonly flashsaleDetailService: FlashsaleDetailService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async create(data: CreateProductDto, @UploadedFile() image: Express.Multer.File): Promise<ProductEntity> {
    const newProduct = this.productRepository.create({ image: image.path, ...data });
    if (!newProduct) {
      throw new BadRequestException(ERROR.USER_EXISTED.MESSAGE);
    }
    const createProduct = await this.productRepository.save(newProduct);
    return createProduct;
  }

  // @Interval(3000)
  async findAll(): Promise<ProductEntity> {
    return this.productRepository.getAll();
  }
  async findAllPage(perPage: number, pageNumber: number, sort: string) {
    return this.productRepository.getAllPage(perPage, pageNumber, sort);
  }

  async findOne(id: number) {
    const productFound = await this.productRepository.findOneByCondition(id);
    if (!productFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return productFound;
  }

  async update(id: any, updateProductDto: UpdateProductDto) {
    const productFound = await this.productRepository.findOneByCondition(id);
    if (!productFound) {
      throw new BadRequestException('không tìm đc sản phẩm');
    }
    const updateProduct = await this.productRepository.update(id, updateProductDto);
    if (updateProduct.flashsale !== null) {
      await this.updatePrice(id, updateProductDto);
    }
    return this.productRepository.findOneByCondition({ id: productFound.id });
  }

  async updatePrice(id: any, updateProductDto: UpdateProductDto) {
    const productFound = await this.productRepository.findOneByCondition(id);
    if (!productFound) {
      throw new BadRequestException('không tìm đc sản phẩm');
    }
    const priceOrigin = productFound.priceOrigin;
    let price = priceOrigin;
    if (productFound.flashsaleDetail !== null) {
      const flashsale = productFound.flashsaleDetail.discount;
      price = priceOrigin - (priceOrigin * flashsale) / 100;
    }
    await this.productRepository.update(id, { ...updateProductDto, price: price });

    return this.productRepository.findOneByCondition({ id: productFound.id });
  }

  async addFlashsale(id: any, updateProductDto: UpdateProductDto) {
    const productFound = await this.productRepository.findOneByCondition(id);
    if (!productFound) {
      throw new BadRequestException('không tìm đc sản phẩm');
    }
    await this.productRepository.update(id, updateProductDto);
    await this.update(id, updateProductDto);

    return this.productRepository.findOneByCondition({ id: productFound.id });
  }

  async updateOriginPrice(id: any, updateProductDto: UpdateProductDto) {
    const productFound = await this.productRepository.findOneByCondition(id);
    if (!productFound) {
      throw new BadRequestException('không tìm đc sản phẩm');
    }
    const price = productFound.priceOrigin;
    await this.productRepository.update(productFound.id, { ...updateProductDto, price: price });

    return this.productRepository.findOneByCondition({ id: productFound.id });
  }

  async remove(id: number) {
    const categoryFound = await this.productRepository.findOneByCondition(id);
    if (!categoryFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    await this.productRepository.delete(id);
    return 'Success!';
  }
  async productSearch(name: string, category: number, brand: number) {
    return this.productRepository.productSearch(name, category, brand);
  }
  async productSearchByFlashsaleDetail(conditions: unknown) {
    return this.productRepository.productSearchByFlashsale(conditions);
  }
  async getPrice(id: number) {
    const productFound = await this.productRepository.findOneByCondition(id);
    if (!productFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return (await this.productRepository.findOneByCondition(id)).price;
  }
  async getDiscount(id: number) {
    const productFound = await this.productRepository.findOneByCondition(id);
    const price = await this.flashsaleDetailService.getFlashsale(productFound.flashsaleDetail);
    return price;
  }
}
