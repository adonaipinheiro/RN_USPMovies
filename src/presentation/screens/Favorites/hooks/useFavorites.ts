// camada: presentation — o hook concentra a lógica; a View é burra.

import { container } from '@di/container';
import { Movie } from '@domain/entities/movie';
import { UiState } from '@presentation/state/uiState';
import { useFavoritesStore } from '@store/useFavoritesStore';

export function useFavorites() {
  // Assina o record inteiro de favoritos — qualquer toggle (nesta tela ou em
  // Populares/Buscar/Detalhe) recalcula a lista automaticamente.
  useFavoritesStore(state => state.favorites);
  const movies: Movie[] = container.getFavorites();

  const state: UiState<Movie[]> = movies.length === 0 ? { type: 'empty' } : { type: 'data', value: movies };

  return {
    state,
    toggleFavorite: (movie: Movie) => container.toggleFavorite(movie),
  };
}
