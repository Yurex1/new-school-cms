import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { RegisterUserDto } from './dto/register-user.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { SignInUserDto } from './dto/signIn-user-dto';
import { AuthService } from './auth.service';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(@Body() signInDto: SignInUserDto, @Res() res: Response) {
    return await this.authService.signIn(signInDto.login, signInDto.password);
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
