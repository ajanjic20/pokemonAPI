import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required.' })
  @Length(6)
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Phone is required.' })
  phone: string;
}
