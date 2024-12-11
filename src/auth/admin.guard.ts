import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { accessTokenSecret } from './constants';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['authToken'];

    if (!token) {
      throw new UnauthorizedException('Access token is missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: accessTokenSecret.secret,
      });

      request['user'] = payload;
    } catch (err) {
      throw new UnauthorizedException('Invalid access token');
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const userId = request['user'].userId;
    const user: User = await this.usersService.findById(userId);

    if (!user || !user.isAdmin) {
      throw new UnauthorizedException(
        "You don't have permission to access this resource",
      );
    }

    return true;
  }
}
