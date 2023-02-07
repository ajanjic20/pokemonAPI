import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';
import { AuthDto } from './authDto/auth-req.dto';
import { AuthResDto } from './authDto/auth-res.dto';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('user')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ type: AuthResDto })
  @ApiBadRequestResponse({ description: `Invalid input` })
  async login(@Body() dto: AuthDto): Promise<AuthResDto> {
    const res = new AuthResDto();
    const userExists = await this.authService.validateUser(
      dto.email,
      dto.password,
    );
    if (!userExists) {
      throw new HttpException(
        'Invalid email, phone or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload = { email: dto.email };
    const secret = this.configService.get('JWT_SECRET');
    res.token = jwt.sign(payload, secret, { expiresIn: '1h' });
    return res;
  }
}
