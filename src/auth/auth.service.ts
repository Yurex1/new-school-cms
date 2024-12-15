import * as bcrypt from 'bcrypt';
import {
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
import { ConfigService } from '@nestjs/config';
import { log } from 'console';

@Injectable()
export class AuthService {
  private accessTokenSecret: string;
  private refreshTokenSecret: string;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {
    this.accessTokenSecret = this.configService.get<string>(
      'ACCESS_TOKEN_SECRET',
    );
    this.refreshTokenSecret = this.configService.get<string>(
      'REFRESH_TOKEN_SECRET',
    );
  }

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
    const { accessToken, refreshToken } = this.generateTokens(user.id);
    // const accessToken = tokens.accessToken;
    // const refreshToken = tokens.refreshToken;

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
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.refreshTokenSecret,
      });
      const user = await this.usersService.findById(payload.id);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newTokens = this.generateTokens(user.id);
      const newRefreshToken = newTokens.refreshToken;
      const newAccessToken = newTokens.accessToken;

      await this.usersService.updateUserRefreshToken(user.id, newRefreshToken);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private generateTokens(userId: string) {
    const payload = { id: userId };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.accessTokenSecret,
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.refreshTokenSecret,
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  async register(login: string, password: string, username: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { login: login },
      });
      if (user) {
        throw new ConflictException('User with this login already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      return await this.prismaService.user.create({
        data: {
          login,
          password: hashedPassword,
          name: username,
          isAdmin: false,
          schoolId: null,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to register user: ${error.message}`,
      );
    }
  }
}
