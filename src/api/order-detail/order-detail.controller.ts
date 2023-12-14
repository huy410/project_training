import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { OrderDetailService } from './order-detail.service';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Order-detail')
@Controller('order-detail')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @Post()
  create(@Body() createOrderDetailDto: CreateOrderDetailDto) {
    return this.orderDetailService.create(createOrderDetailDto);
  }

  @Get()
  findAll() {
    return this.orderDetailService.findAll();
  }

  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.orderDetailService.findOne(+id);
  }

  @Get('search')
  listSearch(@Query() query: any) {
    return this.orderDetailService.orderDetailSearchPrice(query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDetailDto: UpdateOrderDetailDto) {
    return this.orderDetailService.update(+id, updateOrderDetailDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.BAD_REQUEST)
  remove(@Param('id') id: string) {
    return this.orderDetailService.remove(+id);
  }
}
