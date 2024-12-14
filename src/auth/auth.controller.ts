import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { RegisterUserDto } from './dto/register-user.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { SignInUserDto } from './dto/signIn-user-dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Request } from 'express';

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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log('result', result);
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

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.cookies['authToken'];
    if (!accessToken) {
      throw new UnauthorizedException('Access token missing');
    }

    res.clearCookie('authToken', { path: '/', httpOnly: true });

    return res.status(200).json({ success: true });
  }

  @Post('refresh')
  async refreshTokens(@Body() body: { refreshToken: string }) {
    if (!body.refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return await this.authService.refreshTokens(body.refreshToken);
  }
}
