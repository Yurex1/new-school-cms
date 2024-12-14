import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'cookie-session';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions = {
    origin: [
      'http://localhost:3000',
      'https://student-manager-frontend-mu.vercel.app',
    ],
    credentials: true,
  };

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'default-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.enableCors(corsOptions);

  await app.listen(8030);
}

bootstrap();
