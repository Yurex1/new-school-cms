import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { id } });
  }

  async createOne(data: Prisma.UserCreateInput) {
    const result = this.prisma.user.create({
      data,
    });
    return result;
  }
}
