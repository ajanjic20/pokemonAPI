import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeltPokDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Pokemon name or id is required.' })
  identifier: string;
}
