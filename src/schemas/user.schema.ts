import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  password: string;

  @Prop()
  caughtPokemon: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
