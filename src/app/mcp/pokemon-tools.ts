import { inject } from '@angular/core';
import { WebMcpToolDescriptor } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Pokemon } from '../models/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

// v22 (experimental): WebMCP. Tools declared here are registered in the injector via
// provideExperimentalWebMcpTools() and exposed to AI agents in the browser. execute()
// runs in an injection context, so inject() works inside it.
export const pokemonMcpTools: WebMcpToolDescriptor<{
  type: 'object';
  properties: { name: { type: 'string' } };
  required: ['name'];
}>[] = [
  {
    name: 'get_pokemon',
    description: 'Look up a Pokémon by name or id and return its key stats as JSON.',
    inputSchema: {
      type: 'object',
      properties: { name: { type: 'string' } },
      required: ['name'],
    },
    execute: async (args) => {
      const http = inject(HttpClient);
      const pokemon = await firstValueFrom(
        http.get<Pokemon>(`${BASE_URL}/pokemon/${args.name.toLowerCase()}`),
      );
      return JSON.stringify({
        id: pokemon.id,
        name: pokemon.name,
        height: pokemon.height,
        weight: pokemon.weight,
        types: pokemon.types.map((t) => t.type.name),
        abilities: pokemon.abilities.map((a) => a.ability.name),
        stats: pokemon.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
      });
    },
  },
];
