import { Injectable, NotFoundException } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (user === null) {
      throw new NotFoundException(`User ${user} is not found`);
    }
    return user;
  }

  async createOne(data: Prisma.UserCreateInput) {
    const result = await this.prisma.user.create({
      data,
    });
    return result;
  }
  async updateUser(id: string, data: Prisma.UserUpdateInput) {
    await this.findOne(id);
    return await this.prisma.user.update({ where: { id: id }, data });
  }
  async deleteUser(id: string) {
    await this.findOne(id);
    return await this.prisma.user.delete({ where: { id: id } });
  }
}
