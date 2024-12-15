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
import * as jwt from 'jsonwebtoken';
import { UpdateMeDto } from './dto/update-me-dto';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard, AdminGuard)
  @Post('updateSchoolForUser')
  async updateSchoolForUser(
    @Body() body: { userId: string; schoolId: string },
  ) {
    return await this.userService.updateUserSchool(body.userId, body.schoolId);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Put('updateUser/:id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return await this.userService.updateUser(req['user'].id, id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Put('updateMe')
  async updateMe(@Req() req: Request, @Body() updateMeDto: UpdateMeDto) {
    const decodedToken: any = jwt.decode(req.cookies['authToken']);
    return await this.userService.updateMe(decodedToken.id, updateMeDto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getProfile(@Req() req: Request) {
    const decodedToken: any = jwt.decode(req.cookies['authToken']);
    return await this.userService.findById(decodedToken.id);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Delete()
  async delete(@Req() request: Request, @Body() deleteUserDto: DeleteUserDto) {
    if (
      deleteUserDto.ids.includes(
        (jwt.decode(request.cookies['authToken']) as any).id,
      )
    ) {
      return 'You cannot delete yourself';
    }
    return await this.userService.deleteMany(deleteUserDto.ids);
  }
}
