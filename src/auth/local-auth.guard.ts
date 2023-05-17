import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err, user, info, context) {
    const request = context.switchToHttp().getRequest();
    const { login, password } = request.body;

    // Log the request and its body

    // You can perform additional checks or actions here

    return user;
  }
}
