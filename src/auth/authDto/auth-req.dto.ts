import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required.' })
  @Length(6)
  password: string;
}
