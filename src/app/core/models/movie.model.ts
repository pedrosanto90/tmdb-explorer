// Base interface for each movie that comes from the api
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_patch: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_avarage: number;
  vote_count: number;
  genre_ids: number[];
}

//  Listing endpoint allways returns an object
export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// Film details
export interface MovieDetail extends Movie {
  runtime: number | null;
  genres: Genre[];
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
}

export interface Genre {
  id: number;
  name: string;
}

// Credits
export interface Credits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}
