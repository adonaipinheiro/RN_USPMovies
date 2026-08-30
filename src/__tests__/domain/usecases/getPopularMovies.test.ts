import { GetPopularMovies } from '@domain/usecases/getPopularMovies';
import { MoviesRepository } from '@domain/repositories/moviesRepository';
import { Movie } from '@domain/entities/movie';

describe('GetPopularMovies', () => {
  it('delega para repository.getPopular com a página informada', async () => {
    const movies: Movie[] = [
      { id: 1, title: 'Matrix', posterPath: null, overview: '', voteAverage: 8, releaseYear: '1999', genres: [] },
    ];
    const repository: MoviesRepository = {
      getPopular: jest.fn().mockResolvedValue(movies),
      search: jest.fn(),
      getDetails: jest.fn(),
    };

    const getPopularMovies = GetPopularMovies(repository);
    const result = await getPopularMovies(2);

    expect(repository.getPopular).toHaveBeenCalledWith(2);
    expect(result).toBe(movies);
  });
});
