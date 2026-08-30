import { GetMovieDetails } from '@domain/usecases/getMovieDetails';
import { createMoviesRepositoryMock } from '@mocks/moviesRepositoryMock';
import { createMovie } from '@mocks/movieFixture';

describe('GetMovieDetails', () => {
  it('delega para repository.getDetails com o id informado', async () => {
    const movie = createMovie({ id: 42 });
    const repository = createMoviesRepositoryMock();
    repository.getDetails.mockResolvedValue(movie);

    const getMovieDetails = GetMovieDetails(repository);
    const result = await getMovieDetails(42);

    expect(repository.getDetails).toHaveBeenCalledWith(42);
    expect(result).toBe(movie);
  });
});
