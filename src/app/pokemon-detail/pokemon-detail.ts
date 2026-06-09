import { Component, inject, injectAsync, input, onIdle, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { PokemonService } from '../services/pokemon-service';
import { PokemonTypeBadge } from '../pokemon-type-badge/pokemon-type-badge';

@Component({
  selector: 'app-pokemon-detail',
  imports: [NgOptimizedImage, RouterLink, Tabs, TabList, Tab, TabPanel, TabContent, PokemonTypeBadge],
  template: `
    <section class="mx-auto max-w-3xl px-4 py-8">
      <a
        routerLink="/"
        class="mb-4 inline-block cursor-pointer text-sm text-blue-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        ← Back to list
      </a>

      @if (pokemon.isLoading()) {
        <p class="text-slate-500" role="status">Loading…</p>
      } @else if (pokemon.error()) {
        <div class="rounded-lg bg-red-50 p-4 text-red-700" role="alert">Pokémon not found.</div>
      } @else if (pokemon.hasValue()) {
        @let p = pokemon.value();
        <header class="mb-6 flex items-center gap-4">
          @if (p.sprites.front_default) {
            <img [ngSrc]="p.sprites.front_default" [alt]="p.name" width="96" height="96" />
          }
          <div>
            <h1 class="text-3xl font-bold capitalize text-slate-800">{{ p.name }}</h1>
            <p class="text-slate-500">#{{ p.id }}</p>
            <ul class="mt-1 flex gap-2">
              @for (t of p.types; track t.slot) {
                <li><app-pokemon-type-badge [type]="t.type.name" /></li>
              }
            </ul>
          </div>
        </header>

        <div ngTabs class="flex h-64 flex-col">
          <ul
            ngTabList
            [(selectedTab)]="selectedTab"
            class="flex shrink-0 list-none gap-2 border-b-2 border-slate-200 p-0"
          >
            <li
              ngTab
              value="stats"
              class="-mb-0.5 cursor-pointer border-b-2 border-transparent px-4 py-2 text-slate-600 aria-selected:border-blue-600 aria-selected:font-semibold aria-selected:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Stats
            </li>
            <li
              ngTab
              value="abilities"
              class="-mb-0.5 cursor-pointer border-b-2 border-transparent px-4 py-2 text-slate-600 aria-selected:border-blue-600 aria-selected:font-semibold aria-selected:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Abilities
            </li>
            <li
              ngTab
              value="moves"
              class="-mb-0.5 cursor-pointer border-b-2 border-transparent px-4 py-2 text-slate-600 aria-selected:border-blue-600 aria-selected:font-semibold aria-selected:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Moves
            </li>
          </ul>

          <div ngTabPanel value="stats" class="min-h-0 flex-1 overflow-y-auto py-4 [[inert]]:hidden">
            <ng-template ngTabContent>
              <ul class="space-y-1">
                @for (s of p.stats; track s.stat.name) {
                  <li class="flex justify-between">
                    <span class="capitalize text-slate-600">{{ s.stat.name }}</span>
                    <span class="font-semibold">{{ s.base_stat }}</span>
                  </li>
                }
              </ul>
            </ng-template>
          </div>

          <div ngTabPanel value="abilities" class="min-h-0 flex-1 overflow-y-auto py-4 [[inert]]:hidden">
            <ng-template ngTabContent>
              <ul class="list-inside list-disc">
                @for (a of p.abilities; track a.ability.name) {
                  <li class="capitalize">
                    {{ a.ability.name }}
                    @if (a.is_hidden) {
                      <span class="text-xs text-slate-400">(hidden)</span>
                    }
                  </li>
                }
              </ul>
            </ng-template>
          </div>

          <div ngTabPanel value="moves" class="min-h-0 flex-1 overflow-y-auto py-4 [[inert]]:hidden">
            <ng-template ngTabContent>
              <ul class="flex flex-wrap gap-2">
                @for (m of p.moves.slice(0, showAllMoves() ? p.moves.length : 24); track m.move.name) {
                  <li class="rounded bg-slate-100 px-2 py-1 text-xs capitalize">
                    {{ m.move.name }}
                  </li>
                }
              </ul>
              <!-- v22 (stable): arrow functions in template expressions. The signal
                   update callback (v => !v) lives inline in the event binding — no
                   wrapper method needed. -->
              @if (p.moves.length > 24) {
                <button
                  type="button"
                  class="mt-3 cursor-pointer text-sm text-blue-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  (click)="showAllMoves.update((v) => !v)"
                >
                  {{ showAllMoves() ? 'Show fewer' : 'Show all ' + p.moves.length + ' moves' }}
                </button>
              }
            </ng-template>
          </div>
        </div>

        <div class="mt-6">
          <button
            type="button"
            class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            [disabled]="loadingEvolutions()"
            (click)="toggleEvolutions()"
          >
            {{
              loadingEvolutions()
                ? 'Loading…'
                : evolutions()
                  ? 'Hide evolution chain'
                  : 'Show evolution chain'
            }}
          </button>

          @if (evolutions(); as chain) {
            <ol class="mt-4 flex items-center gap-2">
              @for (name of chain; track name; let last = $last) {
                <li class="capitalize">{{ name }}</li>
                @if (!last) {
                  <li aria-hidden="true">→</li>
                }
              }
            </ol>
          }
        </div>
      }
    </section>
  `,
})
export default class PokemonDetail {
  private pokemonService = inject(PokemonService);

  readonly name = input.required<string>();

  // v22 (stable): Angular Aria Tabs drive this model (<ul ngTabList [(selectedTab)]>).
  protected selectedTab = signal('stats');
  protected showAllMoves = signal(false);
  protected pokemon = this.pokemonService.getPokemon(this.name);

  protected evolutions = signal<string[] | null>(null);
  protected loadingEvolutions = signal(false);

  // v22 (stable): injectAsync() lazily injects EvolutionService (own chunk), with
  // prefetch: onIdle so the browser fetches it during idle time before it is requested.
  private loadEvolutionService = injectAsync(() => import('../services/evolution-service'), {
    // prefetch: () => onIdle({ timeout: 100 }),
    prefetch: onIdle,
  });

  protected toggleEvolutions() {
    if (this.evolutions()) {
      this.evolutions.set(null);
      return;
    }
    void this.loadEvolutions();
  }

  private async loadEvolutions() {
    this.loadingEvolutions.set(true);
    const evolutionService = await this.loadEvolutionService();
    this.evolutions.set(await evolutionService.getChain(this.name()));
    this.loadingEvolutions.set(false);
  }
}
