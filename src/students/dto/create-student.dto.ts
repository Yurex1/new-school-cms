import { IsDate, IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreateStudentDto {
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
