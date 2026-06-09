import { Service, Signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Pokemon } from '../models/pokemon';
import { PokemonListParams, PokemonListResponse } from '../models/pokemon-list';
import { PokemonTypeResponse } from '../models/pokemon-type-list';

const BASE_URL = 'https://pokeapi.co/api/v2';

// v22: @Service() replaces @Injectable({ providedIn: 'root' }) for root singletons.
@Service()
export class PokemonService {
  // v22 (stable): httpResource() — signal-driven HTTP. Re-fetches when the source
  // signal changes; returns undefined URL => request is skipped (idle).
  getPokemon(nameOrId: Signal<string | number | null>) {
    return httpResource<Pokemon>(() => {
      const value = nameOrId();
      return value ? `${BASE_URL}/pokemon/${value}` : undefined;
    });
  }

  getAllPokemon(params?: Signal<PokemonListParams>) {
    return httpResource<PokemonListResponse>(
      () => ({
        url: `${BASE_URL}/pokemon`,
        params: { limit: params?.().limit ?? 10, offset: params?.().offset ?? 0 },
      }),
      { defaultValue: { count: 0, next: null, previous: null, results: [] } },
    );
  }

  getPokemonByType(type: Signal<string | null>) {
    return httpResource<PokemonTypeResponse>(
      () => {
        const value = type();
        return value ? `${BASE_URL}/type/${value}` : undefined;
      },
      { defaultValue: { pokemon: [] } },
    );
  }
}
