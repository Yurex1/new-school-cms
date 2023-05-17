import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import cors from 'cors';

import * as session from 'express-session';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
  // somewhere in your initialization file

  app.use(
    session({
      secret: 'my-secret',

      resave: false,
      saveUninitialized: false,
    }),
  );
}
bootstrap();
