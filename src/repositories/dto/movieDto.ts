// camada: repositories — o domínio nunca vê o JSON cru da TMDB.

export interface GenreDto {
  id: number;
  name: string;
}

export interface MovieDto {
  id: number;
  title: string;
  poster_path: string | null;
  overview?: string;
  vote_average?: number;
  release_date?: string;
  genres?: GenreDto[];
}

export interface MoviesPageDto {
  page: number;
  results: MovieDto[];
}
