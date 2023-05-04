import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
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
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.login, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(
    username: string,
    password: string,
    login: string,
    isAdmin: boolean,
    schoolId: string,
  ) {
    console.log(password);
    const user = await this.usersService.createOne({
      name: username,
      password: await bcrypt.hash(password, 10),
      login: login,
      isAdmin: isAdmin,
      school: { connect: { id: schoolId } },
    });

    return user;
  }
}
