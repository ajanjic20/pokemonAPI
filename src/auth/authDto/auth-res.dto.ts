import { ApiProperty } from '@nestjs/swagger';

export class AuthResDto {
  @ApiProperty()
  token: string;
}
