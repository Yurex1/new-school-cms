import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'cookie-session';
import * as session from 'cookie-session';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions = {
    origin: [
      'http://localhost:3000',
      'https://student-manager-frontend-mu.vercel.app',
      'http://172.20.10.4',
      'https://172.20.10.4',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  };

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'default-secret',
      resave: false,
      saveUninitialized: false,
      secure: process.env.NODE_ENV === 'production',
    }),
  );

  app.enableCors(corsOptions);

  await app.listen(8030);
}

bootstrap();
