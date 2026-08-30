// Mock centralizado de MoviesRepository (@domain/repositories/moviesRepository),
// usado pelos testes de caso de uso que dependem dessa interface:
//
//   import { createMoviesRepositoryMock } from '@mocks/moviesRepositoryMock';
//   const repository = createMoviesRepositoryMock();
//   repository.getPopular.mockResolvedValue([...]);
//
// Cada teste sobrescreve só o método que precisa de comportamento específico.

import { MoviesRepository } from '@domain/repositories/moviesRepository';

export function createMoviesRepositoryMock(): jest.Mocked<MoviesRepository> {
  return {
    getPopular: jest.fn(),
    search: jest.fn(),
    getDetails: jest.fn(),
  };
}
