import { ApiProperty } from '@nestjs/swagger';

export class CatchPokListDtoRes {
  @ApiProperty()
  caughtPokemon: string[];
}
