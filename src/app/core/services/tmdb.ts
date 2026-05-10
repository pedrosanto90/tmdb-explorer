import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Credits, MovieDetail, MovieListResponse } from '../models/movie.model';
import { shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Tmdb {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.tmdbBaseUrl;
  private popularMoviesCache$: Observable<MovieListResponse> | null = null;

  getPopularMovies(page: number = 1): Observable<MovieListResponse> {
    if (!this.popularMoviesCache$) {
      const params = new HttpParams().set('page', page);
      this.popularMoviesCache$ = this.http
        .get<MovieListResponse>(`${this.baseUrl}/movie/popular`, { params })
        .pipe(shareReplay(1));
    }
    return this.popularMoviesCache$;
  }

  searchMovies(query: string, page: number = 1): Observable<MovieListResponse> {
    const params = new HttpParams().set('query', query).set('page', page);

    return this.http.get<MovieListResponse>(`${this.baseUrl}/search/movie`, { params });
  }

  getMovieDetail(id: number): Observable<MovieDetail> {
    return this.http.get<MovieDetail>(`${this.baseUrl}/movie/${id}`);
  }

  getMovieCredits(id: number): Observable<Credits> {
    return this.http.get<Credits>(`${this.baseUrl}/movie/${id}/credits`);
  }
}
