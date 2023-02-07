import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class PostPokDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;

  @ApiProperty({ default: [] })
  @IsNotEmpty({ message: 'Types is required.' })
  types: string[];

  @ApiProperty()
  @IsNotEmpty({ message: 'Internal id is required.' })
  internalId: number;

  @ApiProperty({ default: [] })
  @IsNotEmpty({ message: 'Abilities is required.' })
  abilities: string;

  @ApiProperty({ default: [] })
  @IsNotEmpty({ message: 'Evolution is required.' })
  evolutions: string[];

  @ApiProperty({ default: [] })
  @IsNotEmpty({ message: 'Encounter condition is required.' })
  encounterCondition: string[];
}
