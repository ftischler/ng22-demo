import { Component, inject } from '@angular/core';
import { isActive, Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="border-b border-slate-200 bg-white">
      <nav class="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <a
          routerLink="/"
          class="cursor-pointer text-lg font-bold hover:text-blue-600"
          [class.text-blue-600]="homeActive()"
          [class.text-slate-800]="!homeActive()"
        >
          Pokédex
        </a>
        <span class="ml-auto text-xs text-slate-400">Angular 22 showcase</span>
      </nav>
    </header>
    <router-outlet />
  `,
})
export class App {
  private router = inject(Router);

  // v22 (stable): isActive() returns a Signal<boolean> that re-evaluates on route change.
  protected homeActive = isActive('/', this.router, {
    paths: 'exact',
    queryParams: 'ignored',
    fragment: 'ignored',
    matrixParams: 'ignored',
  });
}
