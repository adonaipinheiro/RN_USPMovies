// camada: domain — não conhece framework

import { MoviesRepository } from '@domain/repositories/moviesRepository';

export const SearchMovies = (repository: MoviesRepository) => (query: string, page: number) =>
  repository.search(query, page);
