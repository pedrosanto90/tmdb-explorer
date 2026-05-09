import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { Credits, MovieDetail, MovieListResponse } from '../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class Tmdb {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.tmdbBaseUrl;

  getPopularMovies(page: number = 1): Observable<MovieListResponse> {
    const params = new HttpParams().set('page', page);

    return this.http
      .get<MovieListResponse>(`${this.baseUrl}/movie/popular`, { params })
      .pipe(catchError(this.handleError));
  }

  searchMovies(query: string, page: number = 1): Observable<MovieListResponse> {
    const params = new HttpParams().set('query', query).set('page', page);

    return this.http
      .get<MovieListResponse>(`${this.baseUrl}/search/movie`, { params })
      .pipe(catchError(this.handleError));
  }

  getMovieDetail(id: number): Observable<MovieDetail> {
    return this.http
      .get<MovieDetail>(`${this.baseUrl}/movie/${id}`)
      .pipe(catchError(this.handleError));
  }

  getMovieCredits(id: number): Observable<Credits> {
    return this.http
      .get<Credits>(`${this.baseUrl}/movie/${id}/credits`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    let message = 'An error as occured.';

    if (error.status == 401) {
      message = 'Invalid or missign API Key.';
    } else if (error.status == 404) {
      message = 'Resource not found.';
    } else if (error.status == 0) {
      message = 'No connection. Please check your internet connection.';
    }

    console.error(`[TmdbService] ${message}`);
    return throwError(() => new Error(message));
  }
}
