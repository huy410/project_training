import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FlashsaleDetailService } from './flashsale-detail.service';
import { CreateFlashsaleDetailDto } from './dto/create-flashsale-detail.dto';
import { UpdateFlashsaleDetailDto } from './dto/update-flashsale-detail.dto';
import { JwtAuthGuard } from '../../share/auth/guards/jwt.guard';
import { RoleGuard } from '../../share/auth/guards/role.guard';
import { Roles } from '../../share/auth/decorator/role.decorator';
import { Role } from '../user/role.enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Flashsale-detail')
@Controller('flashsale-detail')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.ADMIN)
export class FlashsaleDetailController {
  constructor(private readonly flashsaleDetailService: FlashsaleDetailService) {}

  @Post()
  create(@Body() createFlashsaleDetailDto: CreateFlashsaleDetailDto) {
    return this.flashsaleDetailService.create(createFlashsaleDetailDto);
  }

  @Get()
  findAll() {
    return this.flashsaleDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flashsaleDetailService.getOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFlashsaleDetailDto: UpdateFlashsaleDetailDto) {
    return this.flashsaleDetailService.update(+id, updateFlashsaleDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flashsaleDetailService.remove(+id);
  }
}
