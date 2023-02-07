import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { Model } from 'mongoose';
import { Pokemon } from 'src/schemas/pokemon.schema';
import { User } from 'src/schemas/user.schema';
import { PostPokDto } from './pokemonDto/postPokemon-req.dto';
import { PutPokDto } from './pokemonDto/putPokemon-req.dto';
import { DeltPokDto } from './pokemonDto/deletePokemon-req.dto';
import { SearchPokDto } from './pokemonDto/searchPokemon-req.dto';
import { CatchPokDto } from './pokemonDto/catchPokemon-req.dto';

export class PokemonService {
  constructor(
    private http: HttpService,
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // scrape and save pokemon to db
  async savePokemon() {
    const count = await this.pokemonModel.count();
    for (let i = count + 1; i <= 151; i++) {
      try {
        const res = await this.axiosReq(
          `https://pokeapi.co/api/v2/pokemon/${i}/`,
        );

        const speciesResponse = await this.axiosReq(res.data.species.url);

        const evolutionResponse = await this.axiosReq(
          speciesResponse.data.evolution_chain.url,
        );

        const encountersResponse = await this.axiosReq(
          `https://pokeapi.co/api/v2/pokemon/${i}/encounters`,
        );

        async function getEvolutionChain(data): Promise<string[]> {
          const evolutionArray = [];
          let eData = data.chain;
          do {
            const noEvolution = eData['evolves_to'].length;
            evolutionArray.push(eData.species.name);
            if (noEvolution > 1) {
              for (let i = 1; i < noEvolution; i++) {
                evolutionArray.push(eData.evolves_to[i].species.name);
              }
            }
            eData = eData['evolves_to'][0];
          } while (!!eData && eData.hasOwnProperty('evolves_to'));
          return evolutionArray;
        }

        const onePokemon = {
          name: res.data.name,
          types: res.data.types.map((type) => type.type.name),
          internalId: i,
          abilities: res.data.abilities.map((ability) => ability.ability.name),
          evolutions: await getEvolutionChain(evolutionResponse.data),
          encounterConditions: this.filterEncounters(
            encountersResponse.data
              .map((elem) => {
                return elem.version_details.map((detail) => {
                  return detail.encounter_details.map((encounter) => {
                    return encounter.condition_values.map(
                      (condition) => condition.name,
                    );
                  });
                });
              })
              .flat(3),
          ),
          owner: 'PokeAPI',
        };
        const newPokemon = new this.pokemonModel(onePokemon);
        await newPokemon.save();
      } catch (err) {
        return `Error: ${err}`;
      }
    }
    return 'Successful storing data.';
  }

  // get stored pokemon from db
  getPokemonPaginated(page: number, size: number) {
    return this.pokemonModel
      .find()
      .skip((page - 1) * size)
      .limit(size);
  }

  // get stored pokemon from db by starting char
  getPokemonByChar(dto: SearchPokDto) {
    return this.pokemonModel
      .find({ name: { $regex: `^${dto.search}` } })
      .exec();
  }

  // get stored pokemon from db by name or id
  getPokemonByNameOrId(str: string) {
    return this.pokemonModel
      .findOne(
        typeof str === 'string' && !Number.isNaN(Number(str))
          ? { internalId: Number(str) }
          : { name: str },
      )
      .exec();
  }

  // create new pokemon in db
  async createPokemon(dto: PostPokDto, owner: string): Promise<string> {
    const name = dto.name
      .toLowerCase()
      .split(' ')
      .map((word, index) =>
        index > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word,
      )
      .join('');

    if (
      (
        await this.pokemonModel
          .find({ $or: [{ internalId: dto.internalId }, { name: dto.name }] })
          .exec()
      ).length === 0
    ) {
      const newPokemon = new this.pokemonModel({
        name: name,
        types: dto.types,
        internalId: dto.internalId,
        abilities: dto.abilities,
        evolutions: dto.evolutions,
        encounterCondition: dto.encounterCondition,
        owner: owner,
      });
      await newPokemon.save();
      return 'Your pokemon is successfully created.';
    }
    return 'There is already a pokemon with that name or id.';
  }

  // update pokemon from db
  async updatePokemon(dto: PutPokDto, owner: string): Promise<string> {
    const name = dto.name
      .toLowerCase()
      .split(' ')
      .map((word, index) =>
        index > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word,
      )
      .join('');
    const updatedPokemon = await this.pokemonModel.findOneAndUpdate(
      { $and: [{ internalId: dto.internalId }, { owner: owner }] },
      {
        name: name,
        types: dto.types,
        internalId: dto.internalId,
        abilities: dto.abilities,
        evolutions: dto.evolutions,
        encounterCondition: dto.encounterCondition,
      },
      {
        new: true,
      },
    );
    if (!updatedPokemon) return `You are not the owner of ${name} pokemon.`;
    return `You successfully updated ${name} pokemon.`;
  }

  // delete pokemon from db
  async deletePokemon(dto: DeltPokDto, owner: string): Promise<string> {
    const deletedPokemon = await this.pokemonModel.findOneAndDelete(
      typeof dto.identifier === 'string' &&
        !Number.isNaN(Number(dto.identifier))
        ? { $and: [{ internalId: dto.identifier, owner: owner }] }
        : { $and: [{ name: dto.identifier, owner: owner }] },
    );
    if (deletedPokemon)
      return typeof dto.identifier === 'string' &&
        !Number.isNaN(Number(dto.identifier))
        ? `You successfully deleted pokemon with id ${dto.identifier}.`
        : `You successfully deleted ${dto.identifier} pokemon.`;
    return typeof dto.identifier === 'string' &&
      !Number.isNaN(Number(dto.identifier))
      ? `You did not create pokemon with id ${dto.identifier}.`
      : `You did not create ${dto.identifier} pokemon.`;
  }

  async catchPokemon(dto: CatchPokDto, user): Promise<string> {
    const catchPokemon = await this.getPokemonByNameOrId(dto.identifier);
    if (!catchPokemon) return 'That pokemon does not exist.';

    const userData = await this.userModel
      .findOne({ email: user }, { email: 1, caughtPokemon: 1 })
      .exec();
    if (Math.floor(Math.random() * 10) <= 4) {
      userData.caughtPokemon.push(catchPokemon.name);
      await this.userModel.findOneAndUpdate(
        { email: user },
        {
          $set: { caughtPokemon: userData.caughtPokemon },
        },
        {
          new: true,
        },
      );
      return `OK`;
    } else {
      return `NOT MODIFIED`;
    }
  }

  // helper-functions
  axiosReq(url: string) {
    return this.http.axiosRef.get(url, {
      headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
    });
  }

  filterEncounters(encounters: string): string[] {
    let arr = [];
    if (encounters.includes('time-night')) arr.push('Night');
    if (encounters.includes('time-morning') || encounters.includes('time-day'))
      arr.push('Day');
    if (arr.length === 0) arr = ['Any'];
    return arr;
  }
}
