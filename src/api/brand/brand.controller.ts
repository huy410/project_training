import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../share/auth/decorator/role.decorator';
import { JwtAuthGuard } from '../../share/auth/guards/jwt.guard';
import { RoleGuard } from '../../share/auth/guards/role.guard';
import { Role } from '../user/role.enum';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@ApiTags('Brand')
@Controller('brand')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.ADMIN)
export class BrandController {
  constructor(private readonly brandService: BrandService) {}
  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  @Get()
  findAll() {
    return this.brandService.getAllBrand();
  }

  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(+id, updateBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }
  @Get('search')
  listSearch(@Query() query: any) {
    return this.brandService.listSearch(query);
  }
}
