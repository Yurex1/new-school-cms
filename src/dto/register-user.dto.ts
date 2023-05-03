import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsBoolean()
  isAdmin: boolean;

  @IsNotEmpty()
  @IsString()
  schoolId: string;
}
