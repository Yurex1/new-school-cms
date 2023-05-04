import { Controller, Post, Put, Delete, Param, Body } from '@nestjs/common';
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
    return await this.userService.deleteUser(id);
  }
}
