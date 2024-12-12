import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDto } from '../../auth/dto/register-user.dto';
import {
  IsString,
  IsNotEmpty,
  IsDate,
  Length,
  IsUUID,
  IsBoolean,
} from 'class-validator';

export class UpdateUserDto extends PartialType(RegisterUserDto) {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  login: string;
}
