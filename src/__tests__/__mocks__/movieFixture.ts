// Fixture centralizada de Movie, usada por praticamente todo teste que
// precisa de um filme de exemplo:
//
//   const movie = createMovie();
//   const movie2 = createMovie({ id: 2, title: 'Matrix Reloaded' });
//
// Sobrescreva só os campos que importam pro cenário do teste.

import { Movie } from '@domain/entities/movie';

export function createMovie(overrides: Partial<Movie> = {}): Movie {
  return {
    id: 1,
    title: 'Matrix',
    posterPath: null,
    overview: '',
    voteAverage: 8,
    releaseYear: '1999',
    genres: [],
    ...overrides,
  };
}
