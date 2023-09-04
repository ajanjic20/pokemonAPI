import { UsePipes, ValidationPipe, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { CustomController } from 'src/custom.decorator';
import { GetUserInfoDto } from './userInfoDto/userInfo-req.dto';
import { GetUserInfoResDto } from './userInfoDto/userInfo-res.dto';
import { AuthenticatedUser } from 'src/auth/currentUser';

@CustomController('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // get user's info
  @Get('info')
  @ApiSecurity('access-token')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOkResponse({ type: GetUserInfoResDto })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async getUserInfo(
    @Query() dto: GetUserInfoDto,
    @AuthenticatedUser() user: string,
  ): Promise<GetUserInfoResDto> {
    const userInfo = await this.userService.getUserInfo(dto, user);
    const res: GetUserInfoResDto = {
      email: userInfo.email,
      name: userInfo.name,
      phone: userInfo.phone,
    };
    return res;
  }
}
