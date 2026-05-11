import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieCardSkeleton } from './movie-card-skeleton';

describe('MovieCardSkeleton', () => {
  let component: MovieCardSkeleton;
  let fixture: ComponentFixture<MovieCardSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieCardSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieCardSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
