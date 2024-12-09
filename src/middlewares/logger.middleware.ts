import { Injectable, NestMiddleware, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { User } from '@prisma/client'; // Importing Prisma User type

@Injectable()
@UseGuards(AuthGuard)
export class LoggerMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const method = req.method;
    const path = req.originalUrl;
    const status = res.statusCode;

    const token = this.extractTokenFromHeader(req);
    if (!token) {
      return next();
    }
    const payload = await this.jwtService.verifyAsync(token, {
      secret: jwtConstants.secret,
    });

    const user: User | null = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (user) {
      await this.prisma.log.create({
        data: {
          method,
          path,
          status,
          userAgent: user.login,
        },
      });
    } else {
      console.log('User not found');
    }
    next();
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
