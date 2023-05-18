import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService, PrismaService, UsersService],
})
export class StudentsModule {}
