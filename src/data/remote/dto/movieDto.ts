// camada: data — formato bruto da fonte remota (TMDB). O domínio nunca vê
// esse JSON cru; é o mapper (em @data/mapper) que faz a tradução.

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
