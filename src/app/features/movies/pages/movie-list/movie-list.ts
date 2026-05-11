import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MovieCard } from '../../components/movie-card/movie-card';
import { SearchBar } from '../../components/search-bar/search-bar';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { catchError, of, Subject, switchMap, takeUntil } from 'rxjs';
import { Tmdb } from '../../../../core/services/tmdb';
import { Movie } from '../../../../core/models/movie.model';
import { ErrorMessage } from '../../../../shared/components/error-message/error-message';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieCardSkeleton } from '../../../../shared/components/movie-card-skeleton/movie-card-skeleton';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [MovieCard, SearchBar, LoadingSpinner, ErrorMessage, MovieCardSkeleton],
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

  readonly skeletonItems = Array(12).fill(0);

  constructor(
    private readonly tmdbService: Tmdb,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const initialQuery = this.route.snapshot.queryParamMap.get('q') ?? '';

    this.searchQuery$
      .pipe(
        switchMap((query) => {
          this.router.navigate([], {
            queryParams: { q: query || null },
            queryParamsHandling: 'merge',
            replaceUrl: true,
          });
          this.isLoading = true;
          this.errorMessage = '';
          this.currentQuery = query;
          this.cdr.markForCheck();

          const request$ = query.trim()
            ? this.tmdbService.searchMovies(query)
            : this.tmdbService.getPopularMovies();

          return request$.pipe(
            catchError((err) => {
              this.errorMessage = err.message;
              this.cdr.markForCheck();
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
        this.cdr.markForCheck();
      });
    this.searchQuery$.next(initialQuery);
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
