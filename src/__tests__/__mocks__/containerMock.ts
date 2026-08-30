// Mock centralizado do container de DI (@di/container), usado por todos os
// testes de telas/hooks via:
//
//   jest.mock('@di/container', () => ({
//     container: require('@mocks/containerMock').createContainerMock(),
//   }));
//
// Os valores padrão abaixo bastam para os testes de "smoke" (App/Router/
// MainStack/MainTabs) renderizarem sem quebrar; testes que precisam de um
// comportamento específico sobrescrevem cada método em seu próprio corpo
// (mockResolvedValue/mockReturnValue/mockReset, como já fazem hoje).

export function createContainerMock() {
  return {
    getPopularMovies: jest.fn().mockResolvedValue([]),
    searchMovies: jest.fn().mockResolvedValue([]),
    getMovieDetails: jest.fn().mockResolvedValue(undefined),
    toggleFavorite: jest.fn(),
    getFavorites: jest.fn().mockReturnValue([]),
    observeIsFavorite: jest.fn().mockReturnValue(false),
  };
}
