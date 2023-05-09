import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import cors from 'cors';

import * as session from 'express-session';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
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
