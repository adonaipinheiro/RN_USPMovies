import { renderHook, act } from '@testing-library/react-native';
import { useFavorites } from '@presentation/screens/Favorites/hooks/useFavorites';
import { container } from '@di/container';
import { useFavoritesStore } from '@store/useFavoritesStore';
import { Movie } from '@domain/entities/movie';

jest.mock('@di/container', () => ({
  container: require('@mocks/containerMock').createContainerMock(),
}));

const mockedContainer = container as unknown as {
  getFavorites: jest.Mock;
  toggleFavorite: jest.Mock;
};

const movie: Movie = {
  id: 1,
  title: 'Matrix',
  posterPath: null,
  overview: '',
  voteAverage: 8,
  releaseYear: '1999',
  genres: [],
};

describe('useFavorites', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favorites: {} });
    mockedContainer.getFavorites.mockReset().mockReturnValue([]);
    mockedContainer.toggleFavorite.mockReset();
  });

  it('expõe estado vazio quando não há favoritos', async () => {
    const { result } = await renderHook(() => useFavorites());

    expect(result.current.state).toEqual({ type: 'empty' });
  });

  it('re-renderiza quando o store de favoritos muda', async () => {
    const { result } = await renderHook(() => useFavorites());

    mockedContainer.getFavorites.mockReturnValue([movie]);
    await act(async () => {
      useFavoritesStore.setState({ favorites: { 1: { movie, addedAt: Date.now() } } });
      await Promise.resolve();
    });

    expect(result.current.state).toEqual({ type: 'data', value: [movie] });
  });

  it('toggleFavorite delega para container.toggleFavorite', async () => {
    const { result } = await renderHook(() => useFavorites());

    result.current.toggleFavorite(movie);

    expect(mockedContainer.toggleFavorite).toHaveBeenCalledWith(movie);
  });
});
