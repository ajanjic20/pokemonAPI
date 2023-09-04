import { Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonModule } from './pokemon/pokemon.module';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { PokemonController } from './pokemon/pokemon.controller';
import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware/middleware-consumer.interface';
import { SearchController } from './pokemon/search.controller';
import { CatchController } from './pokemon/catch.controller';
import { ConfigModule } from '@nestjs/config';
import { MongodbConfigService } from './mongodb.config.service';
import { validate } from './config/env.validation';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongodbConfigService,
    }),
    PokemonModule,
    HttpModule,
    UserModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(PokemonController);
    consumer.apply(AuthMiddleware).forRoutes(SearchController);
    consumer.apply(AuthMiddleware).forRoutes(CatchController);
    consumer.apply(AuthMiddleware).forRoutes(UserController);
  }
}
