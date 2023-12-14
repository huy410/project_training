import { BadRequestException, Injectable } from '@nestjs/common';
import { ERROR } from '../../share/common/error-code.const';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const newCategory = await this.categoryRepository.create(createCategoryDto);
    const createCategory = await this.categoryRepository.save(newCategory);
    if (!newCategory) {
      throw new BadRequestException(ERROR.USER_EXISTED.MESSAGE);
    }
    return createCategory;
  }

  findAll(): Promise<CategoryEntity> {
    return this.categoryRepository.getAll();
  }

  async findOne(id: number) {
    const categoryFound = await this.categoryRepository.findOneByCondition(id);
    if (!categoryFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return this.categoryRepository.findOneByCondition(id);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const categoryFound = await this.categoryRepository.findOneByCondition(id);
    if (!categoryFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    await this.categoryRepository.update(categoryFound.id, updateCategoryDto);

    return this.categoryRepository.findOneByCondition({ id: categoryFound.id });
  }

  async remove(id: number) {
    const categoryFound = await this.categoryRepository.findOneByCondition(id);
    if (!categoryFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    await this.categoryRepository.delete(id);
    return 'Success!';
  }
}
