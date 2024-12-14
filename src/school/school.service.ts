import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { isEmpty } from 'class-validator';

@Injectable()
export class SchoolService {
  constructor(private prisma: PrismaService) {}

  async createOne(data: Prisma.SchoolCreateInput) {
    try {
      return await this.prisma.school.create({ data });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create school',
        error.message,
      );
    }
  }

  async getAllStudents(schoolId: string) {
    if (!schoolId) {
      throw new BadRequestException('School ID is required');
    }

    const result = await this.prisma.student.findMany({
      where: {
        school: {
          id: schoolId,
        },
      },
    });
    return result;
  }

  async createSchool(name: string, type: string) {
    if (!name || !type) {
      throw new BadRequestException(
        'Name and type are required to create a school',
      );
    }

    const existingSchool = await this.prisma.school.findUnique({
      where: { name },
    });

    if (existingSchool) {
      throw new BadRequestException('School with this name already exists');
    }

    return await this.createOne({ name, type });
  }

  async findSchool(id: string) {
    if (!id) {
      throw new BadRequestException('School ID is required');
    }
    const result = await this.prisma.school.findUnique({ where: { id } });
    if (!result) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return result;
  }

  async deleteSchool(ids: string[]) {
    if (!ids || ids.length === 0 || Object.keys(ids).length === 0) {
      throw new BadRequestException('School IDs are required for deletion');
    }
    const [_, __, schoolsResult] = await Promise.all([
      this.prisma.student.deleteMany({
        where: {
          school: {
            id: {
              in: ids,
            },
          },
        },
      }),
      this.prisma.user.updateMany({
        where: {
          schoolId: {
            in: ids,
          },
        },
        data: {
          schoolId: null,
        },
      }),
      this.prisma.school.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      }),
    ]);

    if (schoolsResult.count === 0) {
      throw new NotFoundException(`No schools found to delete`);
    }

    return 'Schools deleted successfully';
  }

  async updateSchool(id: string, data: Prisma.SchoolUpdateInput) {
    if (!id) {
      throw new BadRequestException('School ID is required for update');
    }

    try {
      await this.findSchool(id);
      return await this.prisma.school.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update school',
        error.message,
      );
    }
  }

  async getAll() {
    const result = await this.prisma.school.findMany();
    if (result.length === 0) {
      throw new NotFoundException('No schools found');
    }

    return result;
  }
}
