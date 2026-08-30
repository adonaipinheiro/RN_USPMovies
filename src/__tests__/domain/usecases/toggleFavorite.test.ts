import { ToggleFavorite } from '@domain/usecases/toggleFavorite';
import { FavoritesRepository } from '@domain/repositories/favoritesRepository';
import { Movie } from '@domain/entities/movie';

describe('ToggleFavorite', () => {
  it('delega para repository.toggle com o filme informado', () => {
    const movie: Movie = {
      id: 1,
      title: 'Matrix',
      posterPath: null,
      overview: '',
      voteAverage: 8,
      releaseYear: '1999',
      genres: [],
    };
    const repository: FavoritesRepository = {
      getAll: jest.fn(),
      toggle: jest.fn(),
      isFavorite: jest.fn(),
    };

    const toggleFavorite = ToggleFavorite(repository);
    toggleFavorite(movie);

    expect(repository.toggle).toHaveBeenCalledWith(movie);
  });
});
