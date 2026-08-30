// camada: domain — não conhece framework, rede nem banco.

import { Movie } from '@domain/entities/movie';

export interface MoviesRepository {
  getPopular(page: number): Promise<Movie[]>;
  search(query: string, page: number): Promise<Movie[]>;
  getDetails(id: number): Promise<Movie>;
}
