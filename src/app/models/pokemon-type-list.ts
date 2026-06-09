import { NamedApiResource } from './named-api-resource';

export interface PokemonTypeSlot {
  slot: number;
  pokemon: NamedApiResource;
}

export interface PokemonTypeResponse {
  pokemon: PokemonTypeSlot[];
}

export const POKEMON_TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
] as const;

export type PokemonTypeName = (typeof POKEMON_TYPES)[number];
