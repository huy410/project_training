import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../../share/auth/guards/jwt.guard';
import { RoleGuard } from '../../share/auth/guards/role.guard';
import { Roles } from '../../share/auth/decorator/role.decorator';
import { Role } from '../user/role.enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Product')
@Controller('product')
// @Roles(Role.ADMIN)
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  // @Interval(3000)
  @Get()
  findAllPage(@Query('perPage') perPage = 5, @Query('pageNumber') pageNumber = 1, @Query('sort') sort = 'ASC') {
    return this.productService.findAllPage(+perPage, +pageNumber, sort);
  }
  // @Get()
  // findAll() {
  //   return this.productService.findAll();
  // }

  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Patch('add-flashsale/:id')
  addFlashsale(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    return this.productService.addFlashsale(id, updateProductDto);
  }
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    return this.productService.update(id, updateProductDto);
  }
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
  @Get('search')
  listSearch(@Query('name') name: string, @Query('category') category: number, @Query('brand') brand: number) {
    return this.productService.productSearch(name, category, brand);
  }
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Post('create')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.originalname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async create(@UploadedFile() image: Express.Multer.File, @Body() body: CreateProductDto) {
    return this.productService.create(body, image);
  }
}
