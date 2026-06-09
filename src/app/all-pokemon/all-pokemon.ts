import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField, minLength, debounce } from '@angular/forms/signals';
import { Listbox, Option } from '@angular/aria/listbox';
import { PokemonService } from '../services/pokemon-service';
import { PokemonListParams } from '../models/pokemon-list';
import { POKEMON_TYPES } from '../models/pokemon-type-list';
import { toPokemonCard } from '../util/to-pokemon-card';
import { PokemonCard } from '../pokemon-card/pokemon-card';
import { PokemonCardSkeleton } from '../pokemon-card-skeleton/pokemon-card-skeleton';

@Component({
  selector: 'app-all-pokemon',
  // Not needed anymore, it's the new default:
  // changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, Listbox, Option, PokemonCard, PokemonCardSkeleton],
  template: `
    <section class="mx-auto max-w-6xl px-4 py-8">
      <h1 class="mb-6 text-3xl font-bold text-slate-800">All Pokémon</h1>

      <form class="mb-4" (submit)="$event.preventDefault()">
        <label class="block text-sm font-medium text-slate-600" for="search">Search by name</label>
        <input
          id="search"
          type="search"
          placeholder="e.g. char"
          class="mt-1 w-full max-w-sm rounded-lg border px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          [class.border-slate-300]="!hasNameError()"
          [class.border-red-600]="hasNameError()"
          [attr.aria-invalid]="hasNameError()"
          [formField]="searchForm.name"
        />
        <p class="mt-1 min-h-[1.25rem] text-sm text-red-600" role="alert">
          @if (hasNameError()) {
            {{ searchForm.name().errors()[0].message }}
          }
        </p>
      </form>

      <ul
        ngListbox
        [(value)]="selectedTypes"
        orientation="horizontal"
        aria-label="Filter by type"
        class="mb-6 flex flex-wrap gap-2"
      >
        <li
          ngOption
          value=""
          class="cursor-pointer rounded-full border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700 aria-selected:border-blue-600 aria-selected:bg-blue-600 aria-selected:font-semibold aria-selected:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          All
        </li>
        @for (type of types; track type) {
          <li
            ngOption
            [value]="type"
            class="cursor-pointer rounded-full border border-slate-300 bg-white px-3 py-1 text-sm capitalize text-slate-700 aria-selected:border-blue-600 aria-selected:bg-blue-600 aria-selected:font-semibold aria-selected:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {{ type }}
          </li>
        }
      </ul>

      @if (allPokemon.isLoading() || byType.isLoading()) {
        <!-- v22: animate.leave fades the skeleton grid out as it is removed from the DOM. -->
        <ul
          animate.leave="grid-leave"
          class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
          role="status"
          aria-label="Loading Pokémon"
        >
          @for (i of skeletons; track $index) {
            <li><app-pokemon-card-skeleton /></li>
          }
        </ul>
      } @else if (allPokemon.error() || byType.error()) {
        <div class="rounded-lg bg-red-50 p-4 text-red-700" role="alert">
          <p>Could not load Pokémon.</p>
          <button
            type="button"
            class="mt-2 rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
            (click)="allPokemon.reload()"
          >
            Retry
          </button>
        </div>
      } @else {
        <ul class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          @for (p of cards(); track p.id) {
            <!-- v22: animate.enter runs the .card-enter animation each time a card is
                 inserted — on first load and whenever a filter changes the result set. -->
            <li animate.enter="card-enter">
              <app-pokemon-card [card]="p" />
            </li>
          } @empty {
            <li class="col-span-full text-slate-500">No Pokémon found.</li>
          }
        </ul>
      }
    </section>
  `,
  styles: `
    .card-enter {
      animation: card-enter 300ms ease-out both;
    }
    @keyframes card-enter {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .grid-leave {
      animation: grid-leave 200ms ease-in both;
    }
    @keyframes grid-leave {
      to {
        opacity: 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .card-enter,
      .grid-leave {
        animation: none;
      }
    }
  `,
})
export default class AllPokemon {
  private pokemonService = inject(PokemonService);

  protected types = POKEMON_TYPES;
  protected skeletons = Array.from({ length: 12 });
  // v22 (stable): Angular Aria — <ul ngListbox> drives this model. value is always V[].
  protected selectedTypes = signal<string[]>([]);
  protected selectedType = computed(() => this.selectedTypes()[0] || null);

  // v22 (stable): Signal Forms. The model signal is the source of truth; form() derives
  // its structure from it. minLength() adds validation, debounce() delays model sync.
  protected searchModel = signal({ name: '' });
  protected searchForm = form(this.searchModel, (s) => {
    minLength(s.name, 2, { message: 'Type at least 2 characters' });
    debounce(s.name, 300);
  });

  protected params = signal<PokemonListParams>({ limit: 151, offset: 0 });
  protected allPokemon = this.pokemonService.getAllPokemon(this.params);
  protected byType = this.pokemonService.getPokemonByType(this.selectedType);

  protected cards = computed(() => {
    const type = this.selectedType();
    const entries = type
      ? this.byType.value().pokemon.map((slot) => slot.pokemon)
      : this.allPokemon.value().results;
    const query = this.searchModel().name.trim().toLowerCase();
    const filtered = query.length >= 2 ? entries.filter((e) => e.name.includes(query)) : entries;
    return filtered.map(toPokemonCard);
  });
}
