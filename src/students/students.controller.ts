import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Get,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Admin } from 'src/auth/admin.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { DeleteStudentDto } from './dto/delete-student.dto';
import { type } from 'os';

@Controller('/api/students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @UseGuards(AuthGuard)
  @Admin()
  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.createOne({
      fullName: createStudentDto.fullName,
      locationOfLiving: createStudentDto.locationOfLiving,
      dateOfBirth: createStudentDto.dateOfBirth,
      specialCategory: createStudentDto.specialCategory,
      sex: createStudentDto.sex,
      formOfStudy: createStudentDto.formOfStudy,
      school: { connect: { id: createStudentDto.schoolId } },
    });
  }

  @UseGuards(AuthGuard)
  @Admin()
  @Put(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.updateOne(id, updateStudentDto);
  }

  @UseGuards(AuthGuard)
  @Delete()
  delete(@Body() deleteStudentDto: DeleteStudentDto) {
    console.log('Array: ', Array.isArray(deleteStudentDto.ids));
    return this.studentsService.deleteMany(deleteStudentDto.ids);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.studentsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAll() {
    return await this.studentsService.getAll();
  }
}
