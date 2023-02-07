import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResDto {
  @ApiProperty()
  email: string;
}
