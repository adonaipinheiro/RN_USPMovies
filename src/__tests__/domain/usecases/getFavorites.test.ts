import { GetFavorites } from '@domain/usecases/getFavorites';
import { Movie } from '@domain/entities/movie';
import { createFavoritesRepositoryMock } from '@mocks/favoritesRepositoryMock';

describe('GetFavorites', () => {
  it('delega para repository.getAll', () => {
    const movies: Movie[] = [];
    const repository = createFavoritesRepositoryMock();
    repository.getAll.mockReturnValue(movies);

    const getFavorites = GetFavorites(repository);
    const result = getFavorites();

    expect(repository.getAll).toHaveBeenCalled();
    expect(result).toBe(movies);
  });
});
