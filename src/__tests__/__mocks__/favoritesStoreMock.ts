// Mock centralizado do @store/useFavoritesStore, usado via:
//
//   jest.mock('@store/useFavoritesStore', () => ({
//     useFavoritesStore: require('@mocks/favoritesStoreMock').createFavoritesStoreMock(),
//   }));
//
// Só o suficiente para simular a API estática usada fora de componentes
// (useFavoritesStore.getState()), como o favoritesRepository faz.

export function createFavoritesStoreMock() {
  return {
    getState: jest.fn(),
  };
}
