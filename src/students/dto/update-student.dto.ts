import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';
import {
  IsString,
  IsNotEmpty,
  IsDate,
  Length,
  IsUUID,
  IsDateString,
} from 'class-validator';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  locationOfLiving: string;

  @IsString()
  @IsNotEmpty()
  schoolId: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: Date;

  @IsString()
  @IsNotEmpty()
  specialCategory: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 8)
  sex: string;

  @IsString()
  @IsNotEmpty()
  formOfStudy: string;

  // @IsString()
  // @IsNotEmpty()
  // schoolId: string;
}
