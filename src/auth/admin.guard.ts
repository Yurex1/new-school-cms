import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isAdmin = this.reflector.get<boolean>(
      'isAdmin',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const user: User = await this.usersService.findById(userId);
    return user.isAdmin;
  }
}
