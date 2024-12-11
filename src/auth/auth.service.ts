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
import { accessTokenSecret, refreshTokenSecret } from './constants';
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

  async signIn(login: string, pass: string) {
    const user = await this.usersService.findByLogin(login);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { id: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: accessTokenSecret.secret,
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshTokenSecret.secret,
      expiresIn: '7d',
    });
    await this.prismaService.user.update({
      where: { id: user.id },
      data: { refreshToken: refreshToken },
    });
    return {
      success: true,
      accessToken: `${accessToken}`,
    };
  }

  async refreshTokens(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken);
    const user = await this.usersService.findById(payload.id);

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newRefreshToken = this.jwtService.sign(
      { id: user.id },
      { secret: process.env.JWT_SECRET, expiresIn: '7d' },
    );
    const newAccessToken = this.jwtService.sign(
      { id: user.id },
      { secret: newRefreshToken, expiresIn: '15m' },
    );

    await this.usersService.updateUserRefreshToken(user.id, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async register(
    login: string,
    password: string,
    username: string,
    // isAdmin: boolean,
  ) {
    try {
      // isAdmin = false;
      const hashedPassword = await bcrypt.hash(password, 10);
      return this.prismaService.user.create({
        data: {
          login,
          password: hashedPassword,
          name: username,
          isAdmin: false,
          schoolId: null,
        },
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
