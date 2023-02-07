import { ApiProperty } from '@nestjs/swagger';

export class GetPokDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  size: number;
}
