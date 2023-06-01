import {
  Controller,
  Put,
  Delete,
  Param,
  Body,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user-dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Admin } from 'src/auth/admin.decorator';
import { DeleteUserDto } from './dto/delete-user-dto';
import { AdminGuard } from 'src/auth/admin.guard';
import { Request } from 'express';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Delete()
  delete(@Body() deleteUserDto: DeleteUserDto, @Req() req: Request) {
    console.log('cookies: ', req.cookies);
    return this.userService.deleteMany(deleteUserDto.ids);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    const user = await this.userService.findById(req.user.id);
    return user;
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
}
