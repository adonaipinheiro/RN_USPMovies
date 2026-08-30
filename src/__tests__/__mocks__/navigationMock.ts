// Mock centralizado do @react-navigation/native, usado quando um teste
// precisa controlar o valor de useRoute() sem perder o resto do módulo real
// (do qual @react-navigation/native-stack depende internamente).

export function createNavigationMock(params: Record<string, unknown>) {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useRoute: () => ({ params }),
  };
}
