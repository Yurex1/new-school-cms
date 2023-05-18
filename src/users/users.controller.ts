import {
  Controller,
  Put,
  Delete,
  Param,
  Body,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user-dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Admin } from 'src/auth/admin.decorator';
import { DeleteUserDto } from './dto/delete-user-dto';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard)
  @Admin()
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Admin()
  @Delete()
  delete(@Body() deleteUserDto: DeleteUserDto) {
    return this.userService.deleteMany(deleteUserDto.ids);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    const user = await this.userService.findById(req.user.id);
    return user;
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
}
