import { Controller, Get, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { SearchPokDto } from './pokemonDto/searchPokemon-req.dto';
import { SearchPokDtoRes } from './pokemonDto/searchPokemon-res.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiTags,
  ApiSecurity,
} from '@nestjs/swagger';
@ApiTags('search')
@ApiSecurity('access-token')
@Controller('search')
export class SearchController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  @ApiOkResponse({ type: SearchPokDtoRes })
  @ApiBadRequestResponse({ description: `Invalid input` })
  async getPokemonByChar(@Query() dto: SearchPokDto) {
    const pokemon = await this.pokemonService.getPokemonByChar(dto);
    return SearchPokDtoRes.mapFrom(pokemon);
  }
}
