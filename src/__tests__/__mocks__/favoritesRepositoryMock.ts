// Mock centralizado de FavoritesRepository (@domain/repositories/favoritesRepository),
// usado pelos testes de caso de uso que dependem dessa interface:
//
//   import { createFavoritesRepositoryMock } from '@mocks/favoritesRepositoryMock';
//   const repository = createFavoritesRepositoryMock();
//   repository.isFavorite.mockReturnValue(true);
//
// Cada teste sobrescreve só o método que precisa de comportamento específico.
//
// Não confundir com favoritesStoreMock.ts, que mocka o @store/useFavoritesStore
// (Zustand) usado pela IMPLEMENTAÇÃO do repositório — este aqui mocka o
// próprio contrato de domínio, para testar os casos de uso isoladamente.

import { FavoritesRepository } from '@domain/repositories/favoritesRepository';

export function createFavoritesRepositoryMock(): jest.Mocked<FavoritesRepository> {
  return {
    getAll: jest.fn(),
    toggle: jest.fn(),
    isFavorite: jest.fn(),
  };
}
