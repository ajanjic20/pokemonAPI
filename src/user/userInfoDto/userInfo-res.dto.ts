import { ApiProperty } from '@nestjs/swagger';

export class GetUserInfoResDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;
}
