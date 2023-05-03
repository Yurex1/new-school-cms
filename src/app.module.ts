import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { SchoolModule } from './school/school.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [UsersModule, AuthModule, SchoolModule, StudentsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
