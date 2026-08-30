// camada: domain — não conhece framework

import { FavoritesRepository } from '@domain/repositories/favoritesRepository';

export const GetFavorites = (repository: FavoritesRepository) => () => repository.getAll();
