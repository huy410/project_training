import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetNewTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;
}
