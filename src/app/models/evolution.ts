import { NamedApiResource } from './named-api-resource';

export interface EvolutionLink {
  species: NamedApiResource;
  evolves_to: EvolutionLink[];
}

export interface EvolutionChainResponse {
  chain: EvolutionLink;
}

export interface PokemonSpeciesResponse {
  evolution_chain: { url: string };
}
