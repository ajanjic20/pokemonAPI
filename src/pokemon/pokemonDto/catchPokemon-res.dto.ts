import { ApiProperty } from '@nestjs/swagger';

export class CatchPokDtoRes {
  @ApiProperty()
  message: string;
}
