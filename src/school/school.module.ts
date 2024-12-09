import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [],
  controllers: [SchoolController],
  providers: [SchoolService, PrismaService, UsersService],
})
export class SchoolModule {}
