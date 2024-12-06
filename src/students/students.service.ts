import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async createOne(data: Prisma.StudentCreateInput) {
    try {
      data.dateOfBirth = new Date(data.dateOfBirth);
      return await this.prisma.student.create({ data });
    } catch (error) {
      throw new BadRequestException(
        'Failed to create student: ' + error.message,
      );
    }
  }

  async updateOne(id: string, data: Prisma.StudentUpdateInput) {
    await this.findOne(id);
    try {
      data.dateOfBirth = new Date(data.dateOfBirth.toString());
      return await this.prisma.student.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new BadRequestException(
        'Failed to update student: ' + error.message,
      );
    }
  }

  async findOne(id: string) {
    const result = await this.prisma.student.findUnique({
      where: { id: id },
      include: { school: true },
    });
    if (!result) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return result;
  }

  async getStudentsBySchoolId(schoolId: string) {
    const result = await this.prisma.student.findMany({
      where: { schoolId },
      include: { school: true },
    });
    if (result.length === 0) {
      throw new NotFoundException(
        `No students found for school ID ${schoolId}`,
      );
    }
    return result;
  }

  async deleteMany(ids: string[]) {
    try {
      return await this.prisma.student.deleteMany({
        where: { id: { in: ids } },
      });
    } catch (error) {
      throw new BadRequestException(
        'Failed to delete students: ' + error.message,
      );
    }
  }

  async getAll() {
    const result = await this.prisma.student.findMany({
      include: { school: true },
    });
    if (result.length === 0) {
      throw new NotFoundException(`No students found`);
    }
    return result;
  }
}
