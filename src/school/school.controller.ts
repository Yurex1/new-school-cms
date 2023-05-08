import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Get,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Admin } from 'src/auth/admin.decorator';

@Controller('/api/school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @UseGuards(JwtAuthGuard)
  @Admin()
  @Post('create')
  async create(@Body() createSchoolDto: CreateSchoolDto) {
    return await this.schoolService.createSchool(
      createSchoolDto.name,
      createSchoolDto.type,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Admin()
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSchoolDto: UpdateSchoolDto,
  ) {
    return await this.schoolService.updateSchool(id, updateSchoolDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.schoolService.findSchool(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return await this.schoolService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Admin()
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    return await this.schoolService.deleteSchool(id);
  }
}
