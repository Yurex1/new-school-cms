import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Request, Response } from 'express';
import { accessTokenSecret, refreshTokenSecret } from './constants';
import * as jwt from 'jsonwebtoken';
import { decode } from 'punycode';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const accessToken = request.cookies['authToken'];
    if (!accessToken) {
      throw new UnauthorizedException('Access token missing');
    }
    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: accessTokenSecret,
      });

      const userId = payload?.id;
      if (!userId) {
        throw new UnauthorizedException('Invalid access token');
      }
      request['user'] = payload;
      return true;
    } catch (err) {
      return this.handleRefreshToken(request, response);
    }
  }

  private async handleRefreshToken(
    request: Request,
    response: Response,
  ): Promise<boolean> {
    const accessToken = request.cookies['authToken'];

    if (!accessToken) {
      throw new UnauthorizedException('Access token missing');
    }

    try {
      await this.jwtService.verifyAsync(accessToken, {
        secret: accessTokenSecret,
        ignoreExpiration: true,
      });
      const decodedToken = jwt.decode(accessToken);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const userId = decodedToken?.id;
      if (!userId) {
        throw new UnauthorizedException('Invalid access token payload');
      }
      const user = await this.usersService.findById(userId);

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Refresh token missing in database');
      }

      const refreshToken = user.refreshToken;

      const refreshTokenPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: refreshTokenSecret,
        },
      );
      if (!refreshTokenPayload) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = await this.jwtService.signAsync(
        { id: user.id },
        {
          secret: accessTokenSecret || 'accessTokenSecret',
          expiresIn: '1h',
        },
      );

      response.cookie('authToken', newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      request['user'] = { id: user.id };
      return true;
    } catch (err) {
      console.log('ERR', err);
      throw new UnauthorizedException('Failed to refresh token');
    }
  }
}
