import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../../share/auth/guards/jwt.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { RoleGuard } from '../../share/auth/guards/role.guard';
import { Roles } from '../../share/auth/decorator/role.decorator';
import { Role } from '../user/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GoogleApiService } from 'src/share/services/gg-api/gg-api.service';

@ApiTags('Order')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService, private googleApiService: GoogleApiService) {}
  @ApiBearerAuth()
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    const id = req.user.id;
    return this.orderService.create(createOrderDto, id);
  }
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.orderService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }
  @Get('accept/:id')
  acceptOrder(@Param('id') id: number, @Req() req: any) {
    const userId = req.user.id;
    return this, this.orderService.acceptOrder(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.orderService.updateVoucher(+id, body);
  }

  @HttpCode(HttpStatus.NOT_FOUND)
  @Roles(Role.USER, Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }

  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Get('/report/toGoogleSheet')
  public async getFormReportToSheet() {
    const data = await this.orderService.exportOrder();
    return this.googleApiService.createSpreadSheet(data);
  }

  // // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // async profile(@Req() request) {
  //   return request.user.id;
  // }
}
