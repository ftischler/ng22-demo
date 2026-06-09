import { Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PokemonCard as PokemonCardModel } from '../models/pokemon-card';

@Component({
  selector: 'app-pokemon-card',
  imports: [NgOptimizedImage, RouterLink],
  template: `
    <!-- v22: input.required() for the typed model, @let to bind the signal read once. -->
    @let c = card();
    <a
      [routerLink]="['/pokemon', c.name]"
      class="flex cursor-pointer flex-col items-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <img
        [ngSrc]="c.imageUrl"
        [alt]="c.name"
        width="96"
        height="96"
        class="h-24 w-24 object-contain"
      />
      <span class="mt-2 text-xs font-medium text-slate-400">#{{ c.id }}</span>
      <span class="text-sm font-semibold capitalize text-slate-700">{{ c.name }}</span>
    </a>
  `,
})
export class PokemonCard {
  readonly card = input.required<PokemonCardModel>();
}
