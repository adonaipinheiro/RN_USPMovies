// camada: domain — não conhece framework

import { FavoritesRepository } from '@domain/repositories/favoritesRepository';

export const ObserveIsFavorite = (repository: FavoritesRepository) => (id: number) =>
  repository.isFavorite(id);
