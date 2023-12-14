import { IsPhoneNumber, IsString } from 'class-validator';

export class UpdatePhoneDto {
  @IsString()
  @IsPhoneNumber('VN')
  phoneNumber: string;
}
