import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}
  async createOne(data: Prisma.StudentCreateInput) {
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

  async deleteOne(id: string) {
    await this.findOne(id);
    return await this.prisma.student.delete({
      where: { id: id },
    });
  }
  async getAll() {
    const result = this.prisma.student.findMany();
    if (result === null) {
      throw new NotFoundException(`Students not found`);
    }
    return result;
  }
}
