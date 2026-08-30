// camada: repositories — a store Zustand É, na prática, a implementação
// concreta de FavoritesRepository: hook reativo para os componentes e, via
// getState(), o objeto para o qual o repositório delega.

import { create } from 'zustand';
import { Movie } from '@domain/entities/movie';
import { getObject, setObject } from '@infra/storage/mmkv';

const FAVORITES_KEY = 'favorites';

interface FavoriteEntry {
  movie: Movie;
  addedAt: number;
}

interface FavoritesState {
  favorites: Record<number, FavoriteEntry>;
  getAll: () => Movie[];
  toggle: (movie: Movie) => void;
  isFavorite: (id: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()((set, get) => ({
  favorites: getObject<Record<number, FavoriteEntry>>(FAVORITES_KEY) ?? {},

  getAll: () =>
    Object.values(get().favorites)
      .sort((a, b) => b.addedAt - a.addedAt)
      .map(entry => entry.movie),

  toggle: movie => {
    const next = { ...get().favorites };
    if (next[movie.id]) {
      delete next[movie.id];
    } else {
      next[movie.id] = { movie, addedAt: Date.now() };
    }
    setObject(FAVORITES_KEY, next);
    set({ favorites: next });
  },

  isFavorite: id => Boolean(get().favorites[id]),
}));

// hook usado item a item nas listas — cada card se inscreve só na própria
// chave, então favoritar um filme não re-renderiza os outros cards da lista.
export function useIsFavorite(id: number): boolean {
  return useFavoritesStore(state => Boolean(state.favorites[id]));
}
