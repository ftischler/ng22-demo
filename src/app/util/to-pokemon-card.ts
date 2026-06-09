import { NamedApiResource } from '../models/named-api-resource';
import { PokemonCard } from '../models/pokemon-card';

export function toPokemonCard(entry: NamedApiResource) {
  const id = Number(entry.url.split('/').filter(Boolean).pop());
  return {
    id,
    name: entry.name,
    imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
  } satisfies PokemonCard;
}
