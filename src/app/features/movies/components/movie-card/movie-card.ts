import { Component, input } from '@angular/core';
import { Movie } from '../../../../core/models/movie.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss',
})
export class MovieCard {
  readonly movie = input.required<Movie>();

  readonly imageBaseUrl = environment.tmdbImageBaseUrl;

  get postUrl(): string {
    const path = this.movie().poster_path;
    return path ? `${this.imageBaseUrl}${path}` : 'assets/placeholder.png';
  }

  get rating(): string {
    return this.movie().vote_avarage.toFixed(1);
  }

  get releaseYear(): string {
    return this.movie().release_date?.slice(0, 4) ?? 'N/A';
  }
}
