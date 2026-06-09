import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { EvolutionChainResponse, EvolutionLink, PokemonSpeciesResponse } from '../models/evolution';

const BASE_URL = 'https://pokeapi.co/api/v2';

// v22: @Service(). This service is auto-provided and loaded on demand via injectAsync()
// in PokemonDetail, so it ships in its own lazy chunk (see build output).
@Service()
export default class EvolutionService {
  private http = inject(HttpClient);

  async getChain(name: string) {
    const species = await firstValueFrom(
      this.http.get<PokemonSpeciesResponse>(`${BASE_URL}/pokemon-species/${name}`),
    );
    const chain = await firstValueFrom(
      this.http.get<EvolutionChainResponse>(species.evolution_chain.url),
    );
    return this.flatten(chain.chain);
  }

  private flatten(link: EvolutionLink) {
    const names: string[] = [link.species.name];
    let current = link.evolves_to;
    while (current.length) {
      names.push(current[0].species.name);
      current = current[0].evolves_to;
    }
    return names;
  }
}
