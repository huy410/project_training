import { Injectable } from '@nestjs/common';
import { CreateDeDto } from './dto/create-de.dto';
import { UpdateDeDto } from './dto/update-de.dto';

@Injectable()
export class DeService {
  create(createDeDto: CreateDeDto) {
    return 'This action adds a new de';
  }

  findAll() {
    return `This action returns all de`;
  }

  findOne(id: number) {
    return `This action returns a #${id} de`;
  }

  update(id: number, updateDeDto: UpdateDeDto) {
    return `This action updates a #${id} de`;
  }

  remove(id: number) {
    return `This action removes a #${id} de`;
  }
}
