// camada: domain — não conhece framework

import { MoviesRepository } from '@domain/repositories/moviesRepository';

export const GetPopularMovies = (repository: MoviesRepository) => (page: number) =>
  repository.getPopular(page);
