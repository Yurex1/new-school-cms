import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Get,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { DeleteSchoolDto } from './dto/delete-school-dto';
import { UsersService } from '../users/users.service';
import { AdminGuard } from 'src/auth/admin.guard';

@Controller('/api/schools')
export class SchoolController {
  constructor(
    private readonly schoolService: SchoolService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(AuthGuard, AdminGuard)
  @Post()
  async create(@Body() createSchoolDto: CreateSchoolDto) {
    return await this.schoolService.createSchool(
      createSchoolDto.name,
      createSchoolDto.type,
    );
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSchoolDto: UpdateSchoolDto,
  ) {
    return await this.schoolService.updateSchool(id, updateSchoolDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.schoolService.findSchool(id);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAll(@Request() req) {
    console.log('request: ', req);
    const user = await this.userService.findById(req.user.id);
    console.log(user);
    if (user.isAdmin === true) {
      console.log('User is admin');
      return await this.schoolService.getAll();
    } else {
      console.log('User is not admin');
      return [await this.schoolService.findSchool(user.schoolId)];
    }
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Delete()
  async deleteOne(@Body() deleteSchoolDto: DeleteSchoolDto) {
    return await this.schoolService.deleteSchool(deleteSchoolDto.ids);
  }

  @UseGuards(AuthGuard)
  @Get('getAllStudents/:schoolId')
  async getAllStudents(@Param('schoolId') schoolId: string) {
    console.log('schoolId: ', schoolId);
    return await this.schoolService.getAllStudents(schoolId);
  }
}
