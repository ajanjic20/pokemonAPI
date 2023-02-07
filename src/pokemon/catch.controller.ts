import { Get, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CatchPokDto } from './pokemonDto/catchPokemon-req.dto';
import { CatchPokListDtoRes } from './pokemonDto/catchPokemonList-res.dto';
import { AuthenticatedUser } from 'src/auth/currentUser';
import { CatchPokDtoRes } from './pokemonDto/catchPokemon-res.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { CustomController } from 'src/custom.decorator';
@CustomController('catch')
@ApiSecurity('access-token')
export class CatchController {
  constructor(
    private readonly pokemonService: PokemonService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  @Get()
  @ApiOkResponse({ type: CatchPokDtoRes })
  @ApiBadRequestResponse({ description: `Invalid input` })
  async catchPokemon(
    @Query() dto: CatchPokDto,
    @AuthenticatedUser() user: string,
  ): Promise<CatchPokDtoRes> {
    const res = new CatchPokDtoRes();
    res.message = await this.pokemonService.catchPokemon(dto, user);
    return res;
  }

  @Get('list')
  @ApiOkResponse({ type: CatchPokListDtoRes })
  async getCaughtPokemon(
    @AuthenticatedUser() user: string,
  ): Promise<CatchPokListDtoRes> {
    const response = new CatchPokListDtoRes();
    response.caughtPokemon = (
      await this.userModel.findOne({ email: user }).exec()
    ).caughtPokemon;
    return response;
  }
}
