import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class Login2StepDto {
  @ApiProperty({
    description: 'userId',
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'emailCode',
  })
  @IsNotEmpty()
  @MaxLength(6)
  emailCode: string;

  @ApiProperty({
    description: 'otp',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(6)
  otp: string;
}
