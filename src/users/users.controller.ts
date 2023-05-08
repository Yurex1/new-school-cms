import {
  Controller,
  Put,
  Delete,
  Param,
  Body,
  Get,
  Request,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user-dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Admin } from 'src/auth/admin.decorator';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Admin()
  @Put(':id')
  async update(
    @Param('id') userLogin: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(userLogin, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Admin()
  @Delete(':id')
  async delete(@Param('id') userLogin: string) {
    console.log('delete');
    return await this.userService.deleteUser(userLogin);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
}
