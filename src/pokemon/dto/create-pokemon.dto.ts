import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Sprites } from 'src/seed/interfaces/poke-response-byPokemon.interface';

export class CreatePokemonDto {
  @IsString()
  @MinLength(1)
  readonly name: string;

  @IsInt()
  @IsPositive()
  @Min(1)
  readonly number: number;

  @IsOptional()
  readonly sprites?: Sprites;
}
