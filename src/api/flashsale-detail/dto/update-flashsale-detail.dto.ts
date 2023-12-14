import { PartialType } from '@nestjs/swagger';
import { CreateFlashsaleDetailDto } from './create-flashsale-detail.dto';

export class UpdateFlashsaleDetailDto extends PartialType(CreateFlashsaleDetailDto) {}
