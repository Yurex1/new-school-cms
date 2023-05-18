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
import { Admin } from 'src/auth/admin.decorator';
import { DeleteSchoolDto } from './dto/delete-school-dto';
import { UsersService } from '../users/users.service';

@Controller('/api/school')
export class SchoolController {
  constructor(
    private readonly schoolService: SchoolService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(AuthGuard)
  @Admin()
  @Post()
  async create(@Body() createSchoolDto: CreateSchoolDto) {
    return await this.schoolService.createSchool(
      createSchoolDto.name,
      createSchoolDto.type,
    );
  }

  @UseGuards(AuthGuard)
  @Admin()
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
    const user = await this.userService.findById(req.user.id);
    if (user.isAdmin === true) {
      return await this.schoolService.getAll();
    } else {
      return [await this.schoolService.findSchool(user.schoolId)];
    }
  }

  @UseGuards(AuthGuard)
  @Admin()
  @Delete(':id')
  async deleteOne(@Body() deleteSchoolDto: DeleteSchoolDto) {
    return await this.schoolService.deleteSchool(deleteSchoolDto.ids);
  }
}
