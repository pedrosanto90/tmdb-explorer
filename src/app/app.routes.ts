import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'movies',
    pathMatch: 'full',
  },
  {
    path: 'movies',
    loadComponent: () =>
      import('./features/movies/pages/movie-list/movie-list').then((m) => m.MovieList),
  },
  {
    path: 'movies/:id',
    loadComponent: () =>
      import('./features/movie-detail/pages/movie-detail/movie-detail').then((m) => m.MovieDetail),
  },
  {
    path: '**', // wildcard — qualquer rota que não exista
    redirectTo: 'movies',
  },
];
