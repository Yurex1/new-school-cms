import { Injectable, NestMiddleware, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { accessTokenSecret } from 'src/auth/constants';
@Injectable()
@UseGuards(AuthGuard)
export class LoggerMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const method = req.method;
    const path = req.originalUrl;
    const status = res.statusCode;

    const token = req.cookies['authToken'];
    if (!token) {
      return next();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: accessTokenSecret.secret,
      });
      console.log('payload', payload);
      const user: User | null = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (user) {
        await this.prisma.log.create({
          data: {
            method,
            path,
            status,
            userAgent: user.id,
          },
        });
      } else {
        console.warn(`User with ID ${payload.userId} not found`);
      }
    } catch (error) {
      console.error(
        'Error verifying token or logging user activity:',
        error.message,
      );
    }

    next();
  }
}