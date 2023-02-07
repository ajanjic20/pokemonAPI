import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { DeltPokDto } from './pokemonDto/deletePokemon-req.dto';
import { GetPokDto } from './pokemonDto/getPokemon-req.dto';
import { PostPokDto } from './pokemonDto/postPokemon-req.dto';
import { PutPokDto } from './pokemonDto/putPokemon-req.dto';
import { AuthenticatedUser } from 'src/auth/currentUser';
import { GetPokDtoRes } from './pokemonDto/getPokemon-res.dto';
import { PostPokDtoRes } from './pokemonDto/postPokemon-res.dto';
import { PutPokDtoRes } from './pokemonDto/putPokemon-res.dto';
import { DelPokDtoRes } from './pokemonDto/deletePokemon-res.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiTags,
  ApiSecurity,
} from '@nestjs/swagger';

@ApiTags('pokemon')
@ApiSecurity('access-token')
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  // read all pokemon -  pagination
  @Get()
  @ApiOkResponse({ type: GetPokDtoRes })
  @ApiBadRequestResponse({ description: `Invalid input` })
  async getPokemon(@Query() dto: GetPokDto) {
    dto.page = dto.page || 1;
    dto.size = dto.size || 10;
    const pokemon = await this.pokemonService.getPokemonPaginated(
      dto.page,
      dto.size,
    );
    return GetPokDtoRes.mapFrom(pokemon);
  }

  // create new pokemon
  @Post()
  @ApiOkResponse({ type: PostPokDtoRes })
  @ApiBadRequestResponse({ description: `Invalid input` })
  async postPokemon(
    @Body() dto: PostPokDto,
    @AuthenticatedUser() user: string,
  ): Promise<PostPokDtoRes> {
    const res = new PostPokDtoRes();
    res.message = await this.pokemonService.createPokemon(dto, user);
    return res;
  }

  // update pokemon
  @Put()
  @ApiOkResponse({ type: PutPokDtoRes })
  @ApiBadRequestResponse({ description: `Invalid input` })
  async updatePokemon(
    @Body() dto: PutPokDto,
    @AuthenticatedUser() user: string,
  ): Promise<PutPokDtoRes> {
    const res = new PutPokDtoRes();
    res.message = await this.pokemonService.updatePokemon(dto, user);
    return res;
  }

  // delete pokemon
  @Delete()
  @ApiOkResponse({ type: DelPokDtoRes })
  @ApiBadRequestResponse({ description: `Invalid input` })
  async deletePokemon(
    @Body() dto: DeltPokDto,
    @AuthenticatedUser() user: string,
  ): Promise<DelPokDtoRes> {
    const res = new DelPokDtoRes();
    res.message = await this.pokemonService.deletePokemon(dto, user);
    return res;
  }
}
