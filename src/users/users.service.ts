import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { NEVER, never } from 'rxjs';

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
    if (user == null) {
      return null;
      throw new NotFoundException(`User with login ${username} is not found`);
    }
    return user;
  }

  // async findOne(username: string): Promise<User | undefined> {
  //   return this.users.find((user) => user.username === username);
  // }

  async createOne(data: Prisma.UserCreateInput) {
    const user = await this.prisma.user.findFirst({
      where: {
        login: data.login,
      },
    });
    if (user === null) {
      return await this.prisma.user.create({
        data,
      });
    } else {
      throw new ConflictException(
        `User with the same login ${data.login} has already been created`,
      );
    }
  }

  async getAllUsers() {
    // return this.prisma.user.findMany({ include: { school: true } });
    return this.prisma.user.findMany({ include: { school: true } });
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput) {
    const user: User = await this.findById(id);
    return await this.prisma.user.update({
      where: { id: user.id },
      data,
    });
  }

  async deleteMany(id: string[]) {
    return await this.prisma.user.deleteMany({ where: { id: { in: id } } });
  }

  async deleteUser(username: string) {
    const user: User = await this.findByLogin(username);
    return await this.prisma.user.delete({ where: { id: user.id } });
  }
}
