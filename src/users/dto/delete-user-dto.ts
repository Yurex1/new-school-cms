import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDto } from '../../auth/dto/register-user.dto';
import {
  IsString,
  IsNotEmpty,
  IsDate,
  Length,
  IsUUID,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class DeleteUserDto extends PartialType(RegisterUserDto) {
  @IsArray()
  @IsNotEmpty()
  ids: string[];
}
