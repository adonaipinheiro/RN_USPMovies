import { SearchMovies } from '@domain/usecases/searchMovies';
import { createMoviesRepositoryMock } from '@mocks/moviesRepositoryMock';

describe('SearchMovies', () => {
  it('delega para repository.search com query e página', async () => {
    const repository = createMoviesRepositoryMock();
    repository.search.mockResolvedValue([]);

    const searchMovies = SearchMovies(repository);
    await searchMovies('matrix', 1);

    expect(repository.search).toHaveBeenCalledWith('matrix', 1);
  });
});
