import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { CastMember, MovieDetail as MovieDetails } from '../../../../core/models/movie.model';
import { environment } from '../../../../../environments/environment';
import { catchError, forkJoin, of, Subject, switchMap, takeUntil } from 'rxjs';
import { Tmdb } from '../../../../core/services/tmdb';
import { SlicePipe } from '@angular/common';
import { ErrorMessage } from '../../../../shared/components/error-message/error-message';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [RouterLink, LoadingSpinner, SlicePipe, ErrorMessage],
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.scss',
})
export class MovieDetail implements OnInit, OnDestroy {
  movie: MovieDetails | null = null;
  cast: CastMember[] = [];

  isLoading = false;
  errorMessage = '';

  readonly imageBaseUrl = environment.tmdbBaseUrl;
  private readonly destroy$ = new Subject<void>();

  private currentId: number | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly tmdbService: Tmdb,
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = Number(params.get('id'));
          this.isLoading = true;
          this.errorMessage = '';

          // forkJoin trigger both requests at the same time
          // only returns when both finished
          return forkJoin({
            movie: this.tmdbService.getMovieDetail(id),
            credits: this.tmdbService.getMovieCredits(id),
          }).pipe(
            catchError((err) => {
              this.errorMessage = err.message;
              this.isLoading = false;
              return of(null);
            }),
          );
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((result) => {
        if (result) {
          this.movie = result.movie;
          this.cast = result.credits.cast.slice(0, 10);
        }
        this.isLoading = false;
      });
  }

  onRetry(): void {
    if (this.currentId) {
      this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
        this.currentId = Number(params.get('id'));
      });
    }
  }

  get backdropUrl(): string {
    const path = this.movie?.backdrop_path;
    return path ? `${this.imageBaseUrl}${path}` : '';
  }

  get posterUrl(): string {
    const path = this.movie?.poster_path;
    return path ? `${this.imageBaseUrl}${path}` : '';
  }

  get runtime(): string {
    const minutes = this.movie?.runtime;
    if (!minutes) {
      return 'N/A';
    }
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }

  get rating(): string {
    return this.movie?.vote_average.toFixed(1) ?? 'N/A';
  }

  get director(): string {
    return 'N/A'; // Credits comes from cast, director form crew
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
