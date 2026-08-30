import { GetMovieDetails } from '@domain/usecases/getMovieDetails';
import { MoviesRepository } from '@domain/repositories/moviesRepository';
import { Movie } from '@domain/entities/movie';

describe('GetMovieDetails', () => {
  it('delega para repository.getDetails com o id informado', async () => {
    const movie: Movie = {
      id: 42,
      title: 'Matrix',
      posterPath: null,
      overview: '',
      voteAverage: 8,
      releaseYear: '1999',
      genres: [],
    };
    const repository: MoviesRepository = {
      getPopular: jest.fn(),
      search: jest.fn(),
      getDetails: jest.fn().mockResolvedValue(movie),
    };

    const getMovieDetails = GetMovieDetails(repository);
    const result = await getMovieDetails(42);

    expect(repository.getDetails).toHaveBeenCalledWith(42);
    expect(result).toBe(movie);
  });
});
