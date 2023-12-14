import { BadRequestException, Injectable } from '@nestjs/common';
import { ERROR } from '../../share/common/error-code.const';
import { BrandRepository } from './brand.repository';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandEntity } from './entities/brand.entity';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}
  async create(data: CreateBrandDto): Promise<BrandEntity> {
    const newBrand = this.brandRepository.create(data);
    if (!newBrand) {
      throw new BadRequestException(ERROR.EXISTED.MESSAGE);
    }
    const createBrand = await this.brandRepository.save(newBrand);
    return createBrand;
  }

  async getAllBrand(): Promise<BrandEntity> {
    return this.brandRepository.getAll();
  }

  async findOne(id: number) {
    const productFound = await this.brandRepository.findOneByCondition(id);
    if (!productFound) {
      throw new BadRequestException(ERROR.NOTFOUND.MESSAGE);
    }
    return this.brandRepository.findOneByCondition(id);
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    const brandFound = await this.brandRepository.findOneByCondition(id);
    if (!brandFound) {
      throw new BadRequestException(ERROR.NOTFOUND.MESSAGE);
    }
    const updateBrand = await this.brandRepository.update(brandFound.id, updateBrandDto);

    return updateBrand;
  }

  async remove(id: number) {
    const brandFound = await this.brandRepository.findOneByCondition(id);
    if (!brandFound) {
      throw new BadRequestException(ERROR.NOTFOUND.MESSAGE);
    }
    await this.brandRepository.delete(id);
    return 'Success!';
  }
  async listSearch(name: string) {
    return this.brandRepository.listSearch(name);
  }
}
