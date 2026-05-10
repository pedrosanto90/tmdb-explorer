import { Component, OnDestroy, OnInit } from '@angular/core';
import { MovieCard } from '../../components/movie-card/movie-card';
import { SearchBar } from '../../components/search-bar/search-bar';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { catchError, of, Subject, switchMap, takeUntil } from 'rxjs';
import { Tmdb } from '../../../../core/services/tmdb';
import { Movie } from '../../../../core/models/movie.model';
import { ErrorMessage } from '../../../../shared/components/error-message/error-message';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [MovieCard, SearchBar, LoadingSpinner, ErrorMessage],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.scss',
})
export class MovieList implements OnInit, OnDestroy {
  movies: Movie[] = [];
  isLoading = false;
  errorMessage = '';
  currentQuery = '';
  currentPage = 1;
  totalPages = 1;

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
        this.totalPages = response.total_pages;
        this.isLoading = false;
      });
    this.searchQuery$.next('');
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.searchQuery$.next(this.currentQuery);
  }

  onSearchChange(query: string): void {
    this.searchQuery$.next(query);
  }

  onRetry(): void {
    this.searchQuery$.next(this.currentQuery);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
