import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { JwtAuthGuard } from '../../share/auth/guards/jwt.guard';
import { RoleGuard } from '../../share/auth/guards/role.guard';
import { Roles } from '../../share/auth/decorator/role.decorator';
import { Role } from '../user/role.enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Voucher')
@Controller('voucher')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.ADMIN)
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post()
  create(@Body() createVoucherDto: CreateVoucherDto) {
    return this.voucherService.create(createVoucherDto);
  }

  @Get()
  findAll() {
    return this.voucherService.findAll();
  }

  @Get('discount/:id')
  getDiscount(@Param('id') id: string) {
    return this.voucherService.getDiscount(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voucherService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVoucherDto: UpdateVoucherDto) {
    return this.voucherService.update(+id, updateVoucherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voucherService.remove(+id);
  }
}
