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

@Controller('/api/school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @UseGuards(AuthGuard)
  @Admin()
  @Post('create')
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
    if (req.user.isAdmin === true) {
      return await this.schoolService.getAll();
    } else {
      return [req.user.school];
    }
  }

  @UseGuards(AuthGuard)
  @Admin()
  @Delete(':id')
  async deleteOne(@Body() deleteSchoolDto: DeleteSchoolDto) {
    return await this.schoolService.deleteSchool(deleteSchoolDto.ids);
  }
}
