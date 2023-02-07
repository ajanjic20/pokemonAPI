import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SearchPokDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Pokemon initial letters or full name is required.' })
  search: string;
}
