import { favoritesRepository } from '@repositories/favoritesRepository';
import { useFavoritesStore } from '@store/useFavoritesStore';
import { createMovie } from '@mocks/movieFixture';

jest.mock('@store/useFavoritesStore', () => ({
  useFavoritesStore: require('@mocks/favoritesStoreMock').createFavoritesStoreMock(),
}));

const mockedStore = useFavoritesStore as unknown as { getState: jest.Mock };

const movie = createMovie();

describe('favoritesRepository', () => {
  it('getAll delega para useFavoritesStore.getState().getAll()', () => {
    const getAll = jest.fn().mockReturnValue([movie]);
    mockedStore.getState.mockReturnValue({ getAll, toggle: jest.fn(), isFavorite: jest.fn() });

    expect(favoritesRepository.getAll()).toEqual([movie]);
    expect(getAll).toHaveBeenCalled();
  });

  it('toggle delega para useFavoritesStore.getState().toggle()', () => {
    const toggle = jest.fn();
    mockedStore.getState.mockReturnValue({ getAll: jest.fn(), toggle, isFavorite: jest.fn() });

    favoritesRepository.toggle(movie);

    expect(toggle).toHaveBeenCalledWith(movie);
  });

  it('isFavorite delega para useFavoritesStore.getState().isFavorite()', () => {
    const isFavorite = jest.fn().mockReturnValue(true);
    mockedStore.getState.mockReturnValue({ getAll: jest.fn(), toggle: jest.fn(), isFavorite });

    expect(favoritesRepository.isFavorite(1)).toBe(true);
    expect(isFavorite).toHaveBeenCalledWith(1);
  });
});
