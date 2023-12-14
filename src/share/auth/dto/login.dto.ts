import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'email',
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;
  @ApiProperty({
    description: 'isVerify',
  })
  @ApiProperty({
    description: 'password',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  password: string;
}
