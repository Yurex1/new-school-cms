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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { DeleteSchoolDto } from './dto/delete-school-dto';
import { UsersService } from '../users/users.service';
import { AdminGuard } from 'src/auth/admin.guard';

@Controller('/api/school')
export class SchoolController {
  constructor(
    private readonly schoolService: SchoolService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(AuthGuard, AdminGuard)
  @Post()
  async create(@Body() createSchoolDto: CreateSchoolDto) {
    try {
      return await this.schoolService.createSchool(
        createSchoolDto.name,
        createSchoolDto.type,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSchoolDto: UpdateSchoolDto,
  ) {
    try {
      return await this.schoolService.updateSchool(id, updateSchoolDto);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async get(@Param('id') id: string) {
    try {
      return await this.schoolService.findSchool(id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAll(@Request() req) {
    try {
      const user = await this.userService.findById(req.user.id);
      if (user.isAdmin) {
        return await this.schoolService.getAll();
      }
      return [await this.schoolService.findSchool(user.schoolId)];
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Delete(':id')
  async deleteOne(@Body() deleteSchoolDto: DeleteSchoolDto) {
    try {
      return await this.schoolService.deleteSchool(deleteSchoolDto.ids);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
