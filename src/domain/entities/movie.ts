// camada: domain — não conhece framework, rede nem banco.

export interface Movie {
  id: number;
  title: string;
  posterPath: string | null;
  overview: string;
  voteAverage: number;
  releaseYear: string | null;
  genres: string[];
}

export function moviePosterUrl(movie: Pick<Movie, 'posterPath'>): string | null {
  return movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : null;
}
