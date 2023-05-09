import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LocalAuthGuard } from './local-auth.guard';

import { AuthService } from './auth.service';
import { Admin } from './admin.decorator';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.authService.register(
      registerUserDto.login,
      registerUserDto.password,
      registerUserDto.name,
      registerUserDto.isAdmin,
      registerUserDto.schoolId,
    );
  }
}
