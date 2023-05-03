import { Injectable } from '@nestjs/common';
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
}
