import { NamedApiResource } from './named-api-resource';
import { PokemonTypeName } from './pokemon-type-list';

export interface PokemonType {
  slot: number;
  type: { name: PokemonTypeName; url: string };
}

export interface PokemonAbility {
  ability: NamedApiResource;
  is_hidden: boolean;
  slot: number;
}

export interface PokemonSprites {
  front_default: string | null;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedApiResource;
}

export interface PokemonMove {
  move: NamedApiResource;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: PokemonSprites;
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  moves: PokemonMove[];
}
