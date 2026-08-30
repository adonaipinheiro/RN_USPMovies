// camada: domain — não conhece framework

import { MoviesRepository } from '@domain/repositories/moviesRepository';

export const GetMovieDetails = (repository: MoviesRepository) => (id: number) =>
  repository.getDetails(id);
