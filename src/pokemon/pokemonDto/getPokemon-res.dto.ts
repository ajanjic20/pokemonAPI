import { Pokemon } from 'src/schemas/pokemon.schema';
export class GetPokDtoRes {
  readonly name: string;
  readonly types: string[];
  readonly internalId: number;
  readonly abilities: string[];
  readonly evolutions: string[];
  readonly encounterConditions: string[];

  static mapFrom(pokemon: Pokemon[]) {
    return pokemon.map((el) => ({
      name: el.name,
      types: el.types,
      internalId: el.internalId,
      abilities: el.abilities,
      evolutions: el.evolutions,
      encounterConditions: el.encounterConditions,
    }));
  }
}
