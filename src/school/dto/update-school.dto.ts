import { PartialType } from '@nestjs/mapped-types';
import { CreateSchoolDto } from './create-school.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSchoolDto extends PartialType(CreateSchoolDto) {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}
