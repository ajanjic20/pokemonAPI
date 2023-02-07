import { ApiProperty } from '@nestjs/swagger';

export class PostPokDtoRes {
  @ApiProperty()
  message: string;
}
