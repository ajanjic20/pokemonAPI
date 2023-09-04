import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetUserInfoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;
}
