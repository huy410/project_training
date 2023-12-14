import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  describe: string;
  @IsBoolean()
  @IsNotEmpty()
  active: boolean;
}
