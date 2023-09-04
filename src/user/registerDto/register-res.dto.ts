import { ApiProperty } from '@nestjs/swagger';

export class RegisterResDto {
  @ApiProperty()
  message: string;
}
