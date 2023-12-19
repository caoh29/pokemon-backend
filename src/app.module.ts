import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  imports: [MongooseModule.forRoot(process.env.DATABASE_URL), PokemonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
