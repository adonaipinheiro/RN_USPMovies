import { moviePosterUrl } from '@domain/entities/movie';

describe('moviePosterUrl', () => {
  it('monta a URL completa do pôster quando há posterPath', () => {
    expect(moviePosterUrl({ posterPath: '/abc.jpg' })).toBe('https://image.tmdb.org/t/p/w500/abc.jpg');
  });

  it('retorna null quando não há posterPath', () => {
    expect(moviePosterUrl({ posterPath: null })).toBeNull();
  });
});
