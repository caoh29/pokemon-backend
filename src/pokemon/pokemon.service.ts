import { Model, isValidObjectId } from 'mongoose';

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
//import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PokeResponseByPokemon } from 'src/seed/interfaces/poke-response-byPokemon.interface';
import { FetchAdapter } from 'src/common/adapters/fetch.adapter';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: FetchAdapter,

    //private readonly configService: ConfigService,
  ) {}
  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const { sprites } = await this.http.get<PokeResponseByPokemon>(
        String(createPokemonDto.number),
      );

      const pokemon: Pokemon = await this.pokemonModel.create({
        name: createPokemonDto.name.toLowerCase(),
        number: createPokemonDto.number,
        sprites,
      });

      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(queryParams: PaginationDto) {
    const { limit = 0, offset = 0 } = queryParams;
    const pokemons: Pokemon[] = await this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset);
    return pokemons;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ number: term });
    }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon with id/name/number ${term} not found`,
      );
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name && updatePokemonDto.number) {
      const name = updatePokemonDto.name.toLowerCase();
      try {
        await pokemon.updateOne({
          name,
          number: updatePokemonDto.number,
        });
        return {
          _id: pokemon._id,
          name,
          number: updatePokemonDto.number,
          sprites: pokemon.sprites,
          __v: pokemon.__v,
        };
      } catch (error) {
        this.handleExceptions(error);
      }
    } else if (updatePokemonDto.name && !updatePokemonDto.number) {
      const name = updatePokemonDto.name.toLowerCase();
      try {
        await pokemon.updateOne({ name });
        return {
          _id: pokemon._id,
          name,
          number: pokemon.number,
          sprites: pokemon.sprites,
          __v: pokemon.__v,
        };
      } catch (error) {
        this.handleExceptions(error);
      }
    } else if (!updatePokemonDto.name && updatePokemonDto.number) {
      try {
        await pokemon.updateOne({
          number: updatePokemonDto.number,
        });
        return {
          _id: pokemon._id,
          name: pokemon.name,
          number: updatePokemonDto.number,
          sprites: pokemon.sprites,
          __v: pokemon.__v,
        };
      } catch (error) {
        this.handleExceptions(error);
      }
    } else {
      return pokemon;
    }
  }

  async remove(term: string) {
    const pokemon = await this.findOne(term);
    await pokemon.deleteOne();
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException('Pokemon already exists');
    }
    console.log(error);
    throw new InternalServerErrorException(
      'Something went wrong, please check logs',
    );
  }
}
