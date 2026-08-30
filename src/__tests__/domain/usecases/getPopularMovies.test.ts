import { GetPopularMovies } from '@domain/usecases/getPopularMovies';
import { Movie } from '@domain/entities/movie';
import { createMoviesRepositoryMock } from '@mocks/moviesRepositoryMock';

describe('GetPopularMovies', () => {
  it('delega para repository.getPopular com a página informada', async () => {
    const movies: Movie[] = [
      { id: 1, title: 'Matrix', posterPath: null, overview: '', voteAverage: 8, releaseYear: '1999', genres: [] },
    ];
    const repository = createMoviesRepositoryMock();
    repository.getPopular.mockResolvedValue(movies);

    const getPopularMovies = GetPopularMovies(repository);
    const result = await getPopularMovies(2);

    expect(repository.getPopular).toHaveBeenCalledWith(2);
    expect(result).toBe(movies);
  });
});
