import { container } from '@di/container';

describe('container (DI)', () => {
  it('expõe todos os casos de uso já resolvidos com os repositórios concretos', () => {
    expect(typeof container.getPopularMovies).toBe('function');
    expect(typeof container.searchMovies).toBe('function');
    expect(typeof container.getMovieDetails).toBe('function');
    expect(typeof container.toggleFavorite).toBe('function');
    expect(typeof container.getFavorites).toBe('function');
    expect(typeof container.observeIsFavorite).toBe('function');
  });
});
