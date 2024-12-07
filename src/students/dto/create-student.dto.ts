import {
  IsDate,
  IsISO8601,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  locationOfLiving: string;

  @IsISO8601()
  @IsNotEmpty()
  dateOfBirth: Date;

  @IsString()
  @IsNotEmpty()
  specialCategory: string;

  @IsString()
  @IsNotEmpty()
  // @Length(6, 8)
  sex: string;

  @IsString()
  @IsNotEmpty()
  formOfStudy: string;

  @IsString()
  @IsNotEmpty()
  schoolId: string;
}
