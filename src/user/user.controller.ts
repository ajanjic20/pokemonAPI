import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './userDto/user-req.dto';
import { CreateUserResDto } from './userDto/user-res.dto';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CustomController } from 'src/custom.decorator';

@CustomController('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // create a new user
  @Post('register')
  @ApiOkResponse({ type: CreateUserResDto })
  @ApiBadRequestResponse({ description: `Invalid input` })
  async registerUser(@Body() dto: CreateUserDto) {
    const res = new CreateUserResDto();
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    res.email = await this.userService.createUser(dto, hashedPassword);
    return res.email;
  }
}
