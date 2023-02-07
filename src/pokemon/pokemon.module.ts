import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { SearchController } from './search.controller';
import { UserModule } from 'src/user/user.module';
import { CatchController } from './catch.controller';
import { AuthService } from 'src/auth/auth.service';
import { Pokemon, PokemonSchema } from 'src/schemas/pokemon.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pokemon.name, schema: PokemonSchema },
      { name: User.name, schema: UserSchema },
    ]),
    HttpModule,
    UserModule,
  ],
  controllers: [PokemonController, SearchController, CatchController],
  providers: [PokemonService, AuthService],
  exports: [
    MongooseModule.forFeature([
      { name: Pokemon.name, schema: PokemonSchema },
      { name: User.name, schema: UserSchema },
    ]),
    PokemonService,
  ],
})
export class PokemonModule {}
