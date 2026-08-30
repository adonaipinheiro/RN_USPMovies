import { GetFavorites } from '@domain/usecases/getFavorites';
import { FavoritesRepository } from '@domain/repositories/favoritesRepository';
import { Movie } from '@domain/entities/movie';

describe('GetFavorites', () => {
  it('delega para repository.getAll', () => {
    const movies: Movie[] = [];
    const repository: FavoritesRepository = {
      getAll: jest.fn().mockReturnValue(movies),
      toggle: jest.fn(),
      isFavorite: jest.fn(),
    };

    const getFavorites = GetFavorites(repository);
    const result = getFavorites();

    expect(repository.getAll).toHaveBeenCalled();
    expect(result).toBe(movies);
  });
});
