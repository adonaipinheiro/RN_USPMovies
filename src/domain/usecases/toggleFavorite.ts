// camada: domain — não conhece framework

import { Movie } from '@domain/entities/movie';
import { FavoritesRepository } from '@domain/repositories/favoritesRepository';

export const ToggleFavorite = (repository: FavoritesRepository) => (movie: Movie) =>
  repository.toggle(movie);
