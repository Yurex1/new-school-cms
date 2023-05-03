import { Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from 'src/dto/register-user.dto';

@Controller('/api/users')
export class UsersController {
  //   @Post()
  //   async register(@Body() registerUserDto: RegisterUserDto) {
  //     return await this.authService.register(
  //       registerUserDto.username,
  //       registerUserDto.password,
  //     );
  //   }
}
