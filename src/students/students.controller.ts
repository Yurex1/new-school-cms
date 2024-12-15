import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Get,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { DeleteStudentDto } from './dto/delete-student.dto';
import { UsersService } from 'src/users/users.service';
import { Admin } from 'src/auth/admin.decorator';
import { AdminGuard } from 'src/auth/admin.guard';
import { Request } from 'express';

@Controller('/api/students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Req() req: Request,
    @Body() createStudentDto: CreateStudentDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const user = await this.userService.findById(req.user.id);
    if (user.isAdmin) {
      // можна забрати createStudentDto на майбутнє
      return this.studentsService.createOne({
        fullName: createStudentDto.fullName,
        locationOfLiving: createStudentDto.locationOfLiving,
        dateOfBirth: createStudentDto.dateOfBirth,
        specialCategory: createStudentDto.specialCategory,
        sex: createStudentDto.sex,
        formOfStudy: createStudentDto.formOfStudy,
        school: { connect: { id: createStudentDto.schoolId } },
      });
    } else {
      if (user.schoolId === createStudentDto.schoolId) {
        return this.studentsService.createOne({
          fullName: createStudentDto.fullName,
          locationOfLiving: createStudentDto.locationOfLiving,
          dateOfBirth: createStudentDto.dateOfBirth,
          specialCategory: createStudentDto.specialCategory,
          sex: createStudentDto.sex,
          formOfStudy: createStudentDto.formOfStudy,
          school: { connect: { id: createStudentDto.schoolId } },
        });
      } else {
        return 'You cannot create students for other schools';
      }
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const user = await this.userService.findById(req.user.id);
    if (user.isAdmin) {
      return await this.studentsService.updateOne(id, updateStudentDto);
    } else {
      if (user.schoolId === updateStudentDto.schoolId) {
        return await this.studentsService.updateOne(id, updateStudentDto);
      } else {
        return 'You cannot update students from other schools';
      }
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.studentsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAll(@Req() req) {
    const user = await this.userService.findById(req.user.id);
    if (user.isAdmin === true) {
      return await this.studentsService.getAll();
    } else {
      return await this.studentsService.getStudentsBySchoolId(user.schoolId);
    }
  }

  @UseGuards(AuthGuard)
  @Delete()
  async delete(@Req() req: Request, @Query('ids') ids: string[]) {
    if (ids.length === 0) {
      return 'No ids provided';
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const user = await this.userService.findById(req.user.id);

    if (user.isAdmin) {
      return this.studentsService.deleteMany(ids);
    } else {
      const student = await this.studentsService.findOne(ids[0]);
      const allStudents = await this.studentsService.getStudentsBySchoolId(
        student.schoolId,
      );
      const invalidStudents = allStudents.filter(
        (student) => student.schoolId !== user.schoolId,
      );

      if (invalidStudents.length > 0) {
        return `You cannot delete students from other schools`;
      }

      return this.studentsService.deleteMany(ids);
    }
  }
}
