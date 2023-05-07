import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
export type User = any;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (user === null) {
      throw new NotFoundException(`User ${user} is not found`);
    }
    return user;
  }

  async findByLogin(username: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { login: username },
    });
    if (user === null) {
      throw new NotFoundException(`User with login ${username} is not found`);
    }
    return user;
  }

  // async findOne(username: string): Promise<User | undefined> {
  //   return this.users.find((user) => user.username === username);
  // }

  async createOne(data: Prisma.UserCreateInput) {
    const result = await this.prisma.user.create({
      data,
    });
    return result;
  }
  async updateUser(id: string, data: Prisma.UserUpdateInput) {
    await this.findById(id);
    return await this.prisma.user.update({ where: { id: id }, data });
  }
  async deleteUser(id: string) {
    await this.findById(id);
    return await this.prisma.user.delete({ where: { id: id } });
  }
}
