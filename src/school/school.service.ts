import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SchoolService {
  constructor(private prisma: PrismaService) {}
  async createOne(data: Prisma.SchoolCreateInput) {
    const result = this.prisma.school.create({
      data,
    });
    return result;
  }

  async createSchool(name: string, type: string) {
    const user = await this.createOne({
      name: name,
      type: type,
    });
    return user;
  }

  async findSchool(id: string) {
    const result = await this.prisma.school.findUnique({ where: { id: id } });
    if (result === null) {
      throw new NotFoundException(`School ${id} is not found`);
    }
    return result;
  }

  async deleteSchool(id: string) {
    return this.prisma.school.delete({ where: { id } });
  }

  async updateSchool(id: string, data: Prisma.SchoolUpdateInput) {
    await this.findSchool(id);
    return await this.prisma.school.update({
      where: { id: id },
      data,
    });
  }

  async getAll() {
    const result = await this.prisma.school.findMany();
    if (result === null) {
      throw new NotFoundException(`No schools found`);
    }
    return result;
  }
}
