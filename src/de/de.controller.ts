import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeService } from './de.service';
import { CreateDeDto } from './dto/create-de.dto';
import { UpdateDeDto } from './dto/update-de.dto';

@Controller('de')
export class DeController {
  constructor(private readonly deService: DeService) {}

  @Post()
  create(@Body() createDeDto: CreateDeDto) {
    return this.deService.create(createDeDto);
  }

  @Get()
  findAll() {
    return this.deService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeDto: UpdateDeDto) {
    return this.deService.update(+id, updateDeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deService.remove(+id);
  }
}
