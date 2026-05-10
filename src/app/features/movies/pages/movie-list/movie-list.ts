import { Component, OnDestroy, OnInit } from '@angular/core';
import { MovieCard } from '../../components/movie-card/movie-card';
import { SearchBar } from '../../components/search-bar/search-bar';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { catchError, of, Subject, switchMap, takeUntil } from 'rxjs';
import { Tmdb } from '../../../../core/services/tmdb';
import { Movie } from '../../../../core/models/movie.model';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [MovieCard, SearchBar, LoadingSpinner],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.scss',
})
export class MovieList implements OnInit, OnDestroy {
  movies: Movie[] = [];
  isLoading = false;
  errorMessage = '';
  currentQuery = '';

  private readonly searchQuery$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly tmdbService: Tmdb) {}

  ngOnInit(): void {
    this.searchQuery$
      .pipe(
        switchMap((query) => {
          this.isLoading = true;
          this.errorMessage = '';
          this.currentQuery = query;

          const request$ = query.trim()
            ? this.tmdbService.searchMovies(query)
            : this.tmdbService.getPopularMovies();

          return request$.pipe(
            catchError((err) => {
              this.errorMessage = err.message;
              return of({ results: [], page: 0, total_pages: 0, total_results: 0 });
            }),
          );
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((response) => {
        this.movies = response.results;
        this.isLoading = false;
      });
    this.searchQuery$.next('');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
