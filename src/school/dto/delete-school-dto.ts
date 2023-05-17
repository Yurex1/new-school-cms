import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class DeleteSchoolDto {
  @IsNotEmpty()
  @IsArray()
  ids: string[];
}
