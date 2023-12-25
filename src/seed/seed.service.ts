import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
// import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokeResponse } from './interfaces/poke-response.interface';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { FetchAdapter } from 'src/common/adapters/fetch.adapter';
import { CreateSeedDto } from './dto/create-seed.dto';
import { PokeResponseByPokemon } from './interfaces/poke-response-byPokemon.interface';

@Injectable()
export class SeedService {
  constructor(
    // private readonly pokemonService: PokemonService,
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: FetchAdapter,
  ) {}
  async seedDB(createSeedDto: CreateSeedDto) {
    await this.pokemonModel.deleteMany({});
    const { results } = await this.http.get<PokeResponse>(
      `https://pokeapi.co/api/v2/pokemon?limit=${createSeedDto.amount}`,
    );
    // await Promise.all(
    //   results.map(async ({ name, url }) => {
    //     const segments = url.split('/');
    //     const number = +segments[segments.length - 2];
    //     // await this.pokemonService.create({ name, number });
    //     await this.pokemonModel.create({ name, number });
    //   }),
    // );

    const pokemons: CreatePokemonDto[] = [];
    for (const { name, url } of results) {
      const { sprites } = await this.http.get<PokeResponseByPokemon>(url);
      const segments = url.split('/');
      const number = +segments[segments.length - 2];
      pokemons.push({ name, number, sprites });
    }

    // const pokemons: CreatePokemonDto[] = results.map(async ({ name, url }) => {
    //   const segments = url.split('/');
    //   const number = +segments[segments.length - 2];
    //   return { name, number, sprites };
    // });

    await this.pokemonModel.insertMany(pokemons);

    return {
      message: 'DB seeded',
    };
  }
}
