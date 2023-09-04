import { Body, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { RegisterResDto } from './registerDto/register-res.dto';
import { RegisterDto } from './registerDto/register-req.dto';
import { CustomController } from 'src/custom.decorator';

@CustomController('register')
export class RegisterController {
  constructor(private readonly userService: UserService) {}

  // create a new user
  @Post()
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ type: RegisterResDto })
  @ApiBadRequestResponse({ description: `Invalid input` })
  async registerUser(@Body() dto: RegisterDto) {
    const res = new RegisterResDto();
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    res.message = await this.userService.createUser(dto, hashedPassword);

    return res;
  }
}
