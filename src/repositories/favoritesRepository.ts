// camada: repositories — implementa o contrato do domínio delegando para a
// store Zustand (que por sua vez persiste em MMKV).

import { Movie } from '@domain/entities/movie';
import { FavoritesRepository } from '@domain/repositories/favoritesRepository';
import { useFavoritesStore } from '@store/useFavoritesStore';

export const favoritesRepository: FavoritesRepository = {
  getAll: () => useFavoritesStore.getState().getAll(),
  toggle: (movie: Movie) => useFavoritesStore.getState().toggle(movie),
  isFavorite: (id: number) => useFavoritesStore.getState().isFavorite(id),
};
