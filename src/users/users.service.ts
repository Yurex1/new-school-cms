import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { NEVER, never } from 'rxjs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (user === null) {
      throw new NotFoundException(`User ${user} is not found`);
    }
    return user;
  }

  async getUserWithRefreshToken(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        refreshToken: true,
      },
    });
  }

  async findByLogin(login: string) {
    const user = await this.prisma.user.findFirst({
      where: { login: login },
    });
    if (user == null) {
      throw new NotFoundException(`User with login ${login} is not found`);
    }
    return user;
  }

  async updateMe(id: string, data: Prisma.UserUpdateInput) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password.toString(), 10);
    }
    const user = await this.prisma.user.findFirst({
      where: {
        login: data.login as string,
      },
    });
    if (user && user.id !== id) {
      throw new ConflictException(
        `User with login ${data.login} already exists`,
      );
    }
    if (data.login)
      return await this.prisma.user.update({
        where: { id },
        data,
      });
  }

  async updateUserSchool(userId: string, schoolId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { school: { connect: { id: schoolId } } },
    });
  }

  // async findOne(username: string): Promise<User | undefined> {
  //   return this.users.find((user) => user.username === username);
  // }

  async updateUserRefreshToken(userId: string, refreshToken: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  async createOne(data: Prisma.UserCreateInput) {
    const user = await this.prisma.user.findFirst({
      where: {
        login: data.login,
      },
    });
    if (user) {
      throw new ConflictException(
        `User with login ${data.login} already exists`,
      );
    }
    try {
      const user = await this.prisma.user.create({
        include: { school: true },
        data: {
          ...data,
          school: {
            connect: { id: data.school.connect.id },
          },
        },
      });
      return user;
    } catch (error) {
      throw new BadRequestException(`Failed to create user: ${error.message}`);
    }
  }

  async getAllUsers() {
    //return this.prisma.user.findMany({ include: { school: true } });
    const users = await this.prisma.user.findMany({
      include: { school: true },
    });
    if (!users.length) {
      throw new NotFoundException('No users found');
    }
    return users;
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput) {
    const user: User = await this.findById(id);
    if (data.id || data.refreshToken) {
      throw new BadRequestException(
        'You cannot update user ID or refresh token',
      );
    }
    if (data.password)
      data.password = await bcrypt.hash(data.password.toString(), 10);
    return await this.prisma.user.update({
      where: { id: user.id },
      data,
    });
  }

  async deleteMany(ids: string[]) {
    // return await this.prisma.user.deleteMany({ where: { id: { in: ids } } });
    try {
      return await this.prisma.user.deleteMany({ where: { id: { in: ids } } });
    } catch (error) {
      throw new BadRequestException(`Failed to delete users: ${error.message}`);
    }
  }

  async deleteUser(username: string) {
    const user = await this.findByLogin(username);
    if (!user) {
      throw new NotFoundException(`User with login ${username} not found`);
    }
    try {
      return await this.prisma.user.delete({ where: { id: user.id } });
    } catch (error) {
      throw new BadRequestException(`Failed to delete user: ${error.message}`);
    }
  }
}
