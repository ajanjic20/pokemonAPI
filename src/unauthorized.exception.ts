import { HttpStatus, HttpException } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
  constructor() {
    super('Invalid e-mail or password.', HttpStatus.UNAUTHORIZED);
  }
}
