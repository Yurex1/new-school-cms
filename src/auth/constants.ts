import { ConfigService } from '@nestjs/config';

export const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
