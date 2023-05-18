import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Admin } from 'src/auth/admin.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { DeleteStudentDto } from './dto/delete-student.dto';
import { type } from 'os';
import { UsersService } from 'src/users/users.service';

@Controller('/api/students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly userService: UsersService,
  ) {}

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
    return this.studentsService.deleteMany(deleteStudentDto.ids);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.studentsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAll(@Request() req) {
    const user = await this.userService.findById(req.user.id);
    if (user.isAdmin === true) {
      return await this.studentsService.getAll();
    } else {
      console.log(
        '2',
        await this.studentsService.getStudentsBySchoolId(user.schoolId),
      );
      return await this.studentsService.getStudentsBySchoolId(user.schoolId);
    }
  }
}
