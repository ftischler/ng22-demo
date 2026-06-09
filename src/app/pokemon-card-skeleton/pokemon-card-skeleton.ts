import { Component } from '@angular/core';

@Component({
  selector: 'app-pokemon-card-skeleton',
  template: `
    <div
      class="flex animate-pulse flex-col items-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm motion-reduce:animate-none"
      aria-hidden="true"
    >
      <span class="h-24 w-24 rounded-full bg-slate-200"></span>
      <span class="mt-3 h-3 w-10 rounded bg-slate-200"></span>
      <span class="mt-2 h-4 w-20 rounded bg-slate-200"></span>
    </div>
  `,
})
export class PokemonCardSkeleton {}
