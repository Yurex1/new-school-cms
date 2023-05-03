import { Injectable } from '@nestjs/common';
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
}
