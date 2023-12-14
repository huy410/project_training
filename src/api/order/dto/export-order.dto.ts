import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class ExportOrderDto {
  @IsOptional()
  @IsNumber()
  pay?: number;

  @IsBoolean()
  @IsOptional()
  isBuy?: boolean;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  user?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  voucher?: number;
}
