import * as bcrypt from 'bcrypt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    if (await bcrypt.compare(user?.password, pass)) {
      console.log('Not right password');
      throw new UnauthorizedException();
    }
    const payload = { id: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(
    login: string,
    password: string,
    username: string,
    isAdmin: boolean,
    schoolId: string,
  ) {
    const user = await this.usersService.createOne({
      login: login,
      password: await bcrypt.hash(password, 10),
      name: username,
      isAdmin: isAdmin,
      school: { connect: { id: schoolId } },
    });

    return user;
  }
}
