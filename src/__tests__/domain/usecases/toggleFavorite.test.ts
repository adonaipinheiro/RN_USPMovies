import { ToggleFavorite } from '@domain/usecases/toggleFavorite';
import { createFavoritesRepositoryMock } from '@mocks/favoritesRepositoryMock';
import { createMovie } from '@mocks/movieFixture';

describe('ToggleFavorite', () => {
  it('delega para repository.toggle com o filme informado', () => {
    const movie = createMovie();
    const repository = createFavoritesRepositoryMock();

    const toggleFavorite = ToggleFavorite(repository);
    toggleFavorite(movie);

    expect(repository.toggle).toHaveBeenCalledWith(movie);
  });
});
