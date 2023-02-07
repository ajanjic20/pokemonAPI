import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PokemonService } from './pokemon/pokemon.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Pokemon example')
    .setVersion('1.0')
    .addTag('pokemon')
    .addSecurity('access-token', {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const pokemonService = app.get(PokemonService);
  pokemonService.savePokemon();

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port);
}
bootstrap();
