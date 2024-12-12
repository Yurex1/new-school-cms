import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Request,
  Res,
  UnauthorizedException,
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
    const result = await this.authService.signIn(
      signInDto.login,
      signInDto.password,
    );
    res.cookie('authToken', result.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json(result);
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.authService.register(
      registerUserDto.login,
      registerUserDto.password,
      registerUserDto.name,
      // registerUserDto.isAdmin,
      // registerUserDto.schoolId,
    );
  }

  @Post('refresh')
  async refreshTokens(@Body() body: { refreshToken: string }) {
    if (!body.refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return await this.authService.refreshTokens(body.refreshToken);
  }
}
