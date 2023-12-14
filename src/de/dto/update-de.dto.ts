import { PartialType } from '@nestjs/swagger';
import { CreateDeDto } from './create-de.dto';

export class UpdateDeDto extends PartialType(CreateDeDto) {}
