import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Sprites } from 'src/seed/interfaces/poke-response-byPokemon.interface';

@Schema()
export class Pokemon extends Document {
  // id: string // already given by mongo
  @Prop({
    unique: true,
    index: true,
  })
  name: string;

  @Prop({
    unique: true,
    index: true,
  })
  number: number;

  @Prop({
    type: Object,
  })
  sprites: Sprites;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
