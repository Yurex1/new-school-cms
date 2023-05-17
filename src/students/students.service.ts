import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}
  async createOne(data: Prisma.StudentCreateInput) {
    data.dateOfBirth = new Date(data.dateOfBirth);
    const result = this.prisma.student.create({
      data,
    });
    return result;
  }
  async updateOne(id: string, data: Prisma.StudentUpdateInput) {
    await this.findOne(id);
    return await this.prisma.student.update({
      where: { id },
      data: data,
    });
  }

  async findOne(id: string) {
    const result = await this.prisma.student.findUnique({ where: { id: id } });
    if (result === null) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return result;
  }

  async deleteMany(id: string[]) {
    return await this.prisma.student.deleteMany({ where: { id: { in: id } } });
  }
  async getAll() {
    const result = await this.prisma.student.findMany({
      include: { school: true },
    });
    if (result.length === 0) {
      throw new NotFoundException(`Students not found`);
    }
    return result;
  }
}
