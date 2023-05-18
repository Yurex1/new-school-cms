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
import { Admin } from './admin.decorator';
import { AuthGuard } from '@nestjs/passport';
import { type } from 'os';

// @Controller('/api/auth')
@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(
    @Body() signInDto: SignInUserDto,
    @Res() res: Response,
    @Request() req,
  ) {
    const result = await this.authService.signIn(
      signInDto.login,
      signInDto.password,
    );

    if (result instanceof NotFoundException) {
      const error = { user: 'user not found' };
      return res.status(404).json(error);
    }
    // return result;
    return res.json(result);
  }

  @Admin()
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
