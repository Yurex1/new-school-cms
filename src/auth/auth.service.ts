import * as bcrypt from 'bcrypt';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService, // private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByLogin(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async signIn(username, pass) {
    const user = await this.usersService.findByLogin(username);
    if (user == null) {
      return new NotFoundException('user not found');
    }
    if (!(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException();
    }
    const payload = {
      id: user.id,
    };

    return {
      success: true,
      token: `Bearer ${this.jwtService.sign(payload)}`,
    };
  }

  async register(
    login: string,
    password: string,
    username: string,
    isAdmin: boolean,
    schoolId: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.createOne({
      login: login,
      password: hashedPassword,
      name: username,
      isAdmin: isAdmin,
      school: { connect: { id: schoolId } },
    });

    return user;
  }
}
