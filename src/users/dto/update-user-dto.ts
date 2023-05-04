import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDto } from '../../auth/dto/register-user.dto';
import { IsString, IsNotEmpty, IsDate, Length, IsUUID } from 'class-validator';

export class UpdateUserDto extends PartialType(RegisterUserDto) {
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
