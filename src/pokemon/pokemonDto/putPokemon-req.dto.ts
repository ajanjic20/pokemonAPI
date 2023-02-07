import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PutPokDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Types is required.' })
  types: string[];

  @ApiProperty()
  @IsNotEmpty({ message: 'Internal id is required.' })
  internalId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Abilities is required.' })
  abilities: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Evolution is required.' })
  evolutions: string[];

  @ApiProperty()
  @IsNotEmpty({ message: 'Encounter condition is required.' })
  encounterCondition: string[];
}
