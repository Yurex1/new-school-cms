import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  NotFoundException,
  Delete,
  Get,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('/api/students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('create')
  create(@Body() createStudentDto: CreateStudentDto) {
    console.log('A');
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
  @Put(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    console.log(updateStudentDto.fullName);
    return this.studentsService.updateOne(id, updateStudentDto);
  }
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.studentsService.deleteOne(id);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    console.log('res', this.studentsService.findOne(id));
    return await this.studentsService.findOne(id);
  }
}
