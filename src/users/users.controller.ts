import {
  Controller,
  Put,
  Delete,
  Param,
  Body,
  Get,
  Req,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user-dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';
import { DeleteUserDto } from './dto/delete-user-dto';
import { Request } from 'express';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard, AdminGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Delete()
  async delete(@Body() deleteUserDto: DeleteUserDto, @Req() req: Request) {
    // console.log('Cookies:', req.cookies);
    return await this.userService.deleteMany(deleteUserDto.ids);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getProfile(@Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return await this.userService.findById(req.user.id);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Post('updateSchoolForUser')
  async updateSchoolForUser(
    @Body() body: { userId: string; schoolId: string },
  ) {
    return await this.userService.updateUserSchool(body.userId, body.schoolId);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }
}
