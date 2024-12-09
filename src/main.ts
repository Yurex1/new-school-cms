import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import cors from 'cors';

import * as session from 'express-session';
import { ValidationPipe } from '@nestjs/common';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    cookieParser(),
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  await app.listen(8080);
}
bootstrap();
