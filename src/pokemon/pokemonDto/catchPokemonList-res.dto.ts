import { ApiProperty } from '@nestjs/swagger';

export class CatchPokListDtoRes {
  @ApiProperty({ default: [] })
  caughtPokemon: string[];
}
