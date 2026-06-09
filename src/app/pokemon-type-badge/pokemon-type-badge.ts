import { Component, input } from '@angular/core';
import { PokemonTypeName } from '../models/pokemon-type-list';

@Component({
  selector: 'app-pokemon-type-badge',
  template: `
    <!-- v22: @switch multi-case fallthrough (shared color) + exhaustive @default never.
         @let binds the signal read to a local so TS can narrow it across cases. -->
    @let t = type();
    @switch (t) {
      @case ('fire') {
        <span class="badge bg-orange-500 text-white">{{ t }}</span>
      }
      @case ('water')
      @case ('ice') {
        <span class="badge bg-blue-500 text-white">{{ t }}</span>
      }
      @case ('grass')
      @case ('bug') {
        <span class="badge bg-green-600 text-white">{{ t }}</span>
      }
      @case ('electric') {
        <span class="badge bg-yellow-400 text-yellow-900">{{ t }}</span>
      }
      @case ('psychic')
      @case ('fairy') {
        <span class="badge bg-pink-500 text-white">{{ t }}</span>
      }
      @case ('poison')
      @case ('ghost') {
        <span class="badge bg-purple-600 text-white">{{ t }}</span>
      }
      @case ('ground')
      @case ('rock') {
        <span class="badge bg-amber-700 text-white">{{ t }}</span>
      }
      @case ('fighting') {
        <span class="badge bg-red-700 text-white">{{ t }}</span>
      }
      @case ('flying')
      @case ('dragon') {
        <span class="badge bg-indigo-500 text-white">{{ t }}</span>
      }
      @case ('dark') {
        <span class="badge bg-neutral-800 text-white">{{ t }}</span>
      }
      @case ('steel')
      @case ('normal') {
        <span class="badge bg-slate-400 text-white">{{ t }}</span>
      }
      @default never;
    }
  `,
  styles: `
    .badge {
      display: inline-block;
      border-radius: 9999px;
      padding: 0.125rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: capitalize;
    }
  `,
})
export class PokemonTypeBadge {
  readonly type = input.required<PokemonTypeName>();
}
