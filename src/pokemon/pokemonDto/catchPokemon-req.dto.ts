import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CatchPokDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name or id is required.' })
  identifier: string;
}
