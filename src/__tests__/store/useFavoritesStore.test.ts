import { renderHook, act } from '@testing-library/react-native';
import { useFavoritesStore, useIsFavorite } from '@store/useFavoritesStore';
import { storage } from '@infra/storage/mmkv';
import { createMovie } from '@mocks/movieFixture';

const movie = createMovie();
const movie2 = createMovie({ id: 2, title: 'Matrix Reloaded', voteAverage: 7, releaseYear: '2003' });

describe('useFavoritesStore', () => {
  beforeEach(() => {
    storage.clearAll();
    useFavoritesStore.setState({ favorites: {} });
  });

  it('começa sem favoritos', async () => {
    expect(useFavoritesStore.getState().getAll()).toEqual([]);
  });

  it('toggle adiciona um filme aos favoritos', async () => {
    useFavoritesStore.getState().toggle(movie);

    expect(useFavoritesStore.getState().isFavorite(movie.id)).toBe(true);
    expect(useFavoritesStore.getState().getAll()).toEqual([movie]);
  });

  it('toggle remove um filme já favoritado', async () => {
    useFavoritesStore.getState().toggle(movie);
    useFavoritesStore.getState().toggle(movie);

    expect(useFavoritesStore.getState().isFavorite(movie.id)).toBe(false);
    expect(useFavoritesStore.getState().getAll()).toEqual([]);
  });

  it('getAll ordena os favoritos do mais recente para o mais antigo', async () => {
    useFavoritesStore.getState().toggle(movie);
    await new Promise(resolve => setTimeout(resolve, 5));
    useFavoritesStore.getState().toggle(movie2);

    expect(useFavoritesStore.getState().getAll().map(m => m.id)).toEqual([2, 1]);
  });

  it('persiste os favoritos no MMKV', async () => {
    useFavoritesStore.getState().toggle(movie);

    const raw = storage.getString('favorites');
    expect(raw).toBeDefined();
    expect(JSON.parse(raw as string)[movie.id].movie).toEqual(movie);
  });

  it('useIsFavorite reage a mudanças no store', async () => {
    const { result } = await renderHook(() => useIsFavorite(movie.id));
    expect(result.current).toBe(false);

    await act(async () => {
      useFavoritesStore.getState().toggle(movie);
      await Promise.resolve();
    });

    expect(result.current).toBe(true);
  });
});
