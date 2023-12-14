import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  isVerified: boolean;

  @IsNotEmpty()
  @IsString()
  password: string;

  //  @IsNotEmpty()
  //  @IsString()
  //  issuedBy: string;

  //  @IsNotEmpty()
  //  @IsString()
  //  issuedDate: string;

  //  @IsNotEmpty()
  //  @IsString()
  //  daysInTrial: string;
}
