import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';
import { IsString, IsNotEmpty, IsDate, Length, IsUUID } from 'class-validator';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  locationOfLiving: string;

  @IsString()
  @IsNotEmpty()
  locationOfStudy: string;

  @IsDate()
  @IsNotEmpty()
  dateOfBirth: Date;

  @IsString()
  @IsNotEmpty()
  specialCategory: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 6)
  sex: string;

  @IsString()
  @IsNotEmpty()
  formOfStudy: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  schoolId: string;
}
