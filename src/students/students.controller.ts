import { Controller, Post, Body } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('create')
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.createOne({
      fullName: createStudentDto.fullName,
      locationOfLiving: createStudentDto.locationOfLiving,
      locationOfStudy: createStudentDto.locationOfStudy,
      dateOfBirth: createStudentDto.dateOfBirth,
      specialCategory: createStudentDto.specialCategory,
      sex: createStudentDto.sex,
      formOfStudy: createStudentDto.formOfStudy,
      school: { connect: { id: createStudentDto.schoolId } },
    });
  }
}
