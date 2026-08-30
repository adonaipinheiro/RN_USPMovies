// Mock centralizado do @routes/navigation/navigation (o wrapper fino sobre o
// navigationRef do React Navigation), usado via:
//
//   jest.mock('@routes/navigation/navigation', () => ({
//     navigation: require('@mocks/navigationServiceMock').createNavigationServiceMock(),
//   }));
//
// Não confundir com navigationMock.ts, que mocka o próprio pacote
// @react-navigation/native — este mocka o coordinator/navigation do app.

export function createNavigationServiceMock() {
  return {
    push: jest.fn(),
    replace: jest.fn(),
    goBack: jest.fn(),
  };
}
