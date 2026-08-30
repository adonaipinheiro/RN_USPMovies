import { SearchMovies } from '@domain/usecases/searchMovies';
import { MoviesRepository } from '@domain/repositories/moviesRepository';

describe('SearchMovies', () => {
  it('delega para repository.search com query e página', async () => {
    const repository: MoviesRepository = {
      getPopular: jest.fn(),
      search: jest.fn().mockResolvedValue([]),
      getDetails: jest.fn(),
    };

    const searchMovies = SearchMovies(repository);
    await searchMovies('matrix', 1);

    expect(repository.search).toHaveBeenCalledWith('matrix', 1);
  });
});
