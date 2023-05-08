import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  NotFoundException,
  Delete,
  Get,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Admin } from 'src/auth/admin.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('/api/students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @UseGuards(JwtAuthGuard)
  @Admin()
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

  @UseGuards(JwtAuthGuard)
  @Admin()
  @Put(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    console.log(updateStudentDto.fullName);
    return this.studentsService.updateOne(id, updateStudentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.studentsService.deleteOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.studentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return await this.studentsService.getAll();
  }
}
