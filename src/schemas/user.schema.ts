import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: Buffer })
  encryptedAesKey: Buffer;

  @Prop({ type: Buffer })
  privateKey: Buffer;

  @Prop()
  email: string;

  @Prop()
  name: string;

  @Prop()
  phone: string;

  @Prop()
  password: string;

  @Prop()
  caughtPokemon: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
