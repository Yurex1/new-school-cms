import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    try {
      const user = await this.usersService.findByLogin(username);
      if (user && (await bcrypt.compare(password, user.password))) {
        return user;
      }
      return null;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to validate user: ${error.message}`,
      );
    }
  }

  async signIn(username: string, pass: string) {
    try {
      const user = await this.usersService.findByLogin(username);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (!(await bcrypt.compare(pass, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = { id: user.id };
      const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      await this.prismaService.user.update({
        where: { id: user.id },
        data: { refreshToken: refreshToken },
      });
      return {
        success: true,
        accessToken: `${accessToken}`,
        refreshToken: `${refreshToken}`,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to sign in: ${error.message}`,
      );
    }
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findById(payload.id);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = this.jwtService.sign(
        { id: user.id },
        { expiresIn: '15m' },
      );
      const newRefreshToken = this.jwtService.sign(
        { id: user.id },
        { expiresIn: '7d' },
      );

      await this.usersService.updateUserRefreshToken(user.id, newRefreshToken);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async register(
    login: string,
    password: string,
    username: string,
    isAdmin: boolean,
    schoolId: string,
  ) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      return this.usersService.createOne({
        login,
        password: hashedPassword,
        name: username,
        isAdmin,
        school: { connect: { id: schoolId } },
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw new InternalServerErrorException(
        `Failed to register user: ${error.message}`,
      );
    }
  }
}
