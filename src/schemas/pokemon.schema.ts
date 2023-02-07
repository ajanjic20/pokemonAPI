import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PokemonDocument = HydratedDocument<Pokemon>;

@Schema()
export class Pokemon {
  @Prop()
  name: string;

  @Prop()
  types: string[];

  @Prop()
  internalId: number;

  @Prop()
  abilities: string[];

  @Prop()
  evolutions: string[];

  @Prop()
  encounterConditions: string[];

  @Prop()
  owner: string;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
