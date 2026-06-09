import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./all-pokemon/all-pokemon'),
  },
  {
    path: 'pokemon/:name',
    loadComponent: () => import('./pokemon-detail/pokemon-detail'),
  },
];
