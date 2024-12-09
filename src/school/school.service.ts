import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

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

  async createSchool(name: string, type: string) {
    if (!name || !type) {
      throw new BadRequestException(
        'Name and type are required to create a school',
      );
    }
    return await this.createOne({ name, type });
  }

  async findSchool(id: string) {
    if (!id) {
      throw new BadRequestException('School ID is required');
    }
    console.log('123123');
    const result = await this.prisma.school.findUnique({ where: { id } });
    console.log(result);
    if (!result) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return result;
  }

  async deleteSchool(ids: string[]) {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('School IDs are required for deletion');
    }
    await this.prisma.student.deleteMany({
      where: {
        school: {
          id: {
            in: ids,
          },
        },
      },
    });

    await this.prisma.user.deleteMany({
      where: {
        school: {
          id: {
            in: ids,
          },
        },
      },
    });

    const result = await this.prisma.school.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (result.count === 0) {
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
