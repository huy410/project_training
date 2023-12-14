import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDetailDto {
  // @IsNumber()
  // price: number;
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  price: number;

  @IsNumber()
  product: number;

  @IsNumber()
  order: number;
}
