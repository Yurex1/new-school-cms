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
  Query,
  BadRequestException,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { AuthGuard } from 'src/auth/auth.guard';
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
  @Get()
  async getAll(@Request() req) {
    const user = await this.userService.findById(req.user.id);
    if (user.isAdmin === true) {
      return await this.schoolService.getAll();
    } else {
      return [await this.schoolService.findSchool(user.schoolId)];
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.schoolService.findSchool(id);
  }

  @UseGuards(AuthGuard)
  @Get('getAllStudents/:schoolId')
  async getAllStudents(@Param('schoolId') schoolId: string) {
    if (!schoolId) {
      throw new BadRequestException('School ID is required');
    }
    return await this.schoolService.getAllStudents(schoolId);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Delete()
  async deleteSchools(@Query('ids') ids: string[]) {
    return await this.schoolService.deleteSchool(ids);
  }
}
