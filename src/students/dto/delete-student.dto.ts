import { IsNotEmpty, IsArray } from 'class-validator';

export class DeleteStudentDto {
  @IsArray()
  @IsNotEmpty()
  ids: string[];
}
