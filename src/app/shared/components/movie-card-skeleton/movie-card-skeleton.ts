import { Component } from '@angular/core';

@Component({
  selector: 'app-movie-card-skeleton',
  imports: [],
  templateUrl: './movie-card-skeleton.html',
  styleUrl: './movie-card-skeleton.scss',
})
export class MovieCardSkeleton {
  readonly skeletonItems = Array(12).fill(0);
}
