import {
  Controller,
  Put,
  Delete,
  Param,
  Body,
  Get,
  Req,
  ExecutionContext,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user-dto';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    console.log('1231');
    return await this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    console.log('delete');
    return await this.userService.deleteUser(id);
  }

  @Get('/me')
  async getCurrentUser(@Req() req: Request) {
    console.log(req.session);
    return req.sessionID;
  }
}
