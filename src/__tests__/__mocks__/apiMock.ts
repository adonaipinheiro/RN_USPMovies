// Mock centralizado do @infra/http/api (instância axios), usado via:
//
//   jest.mock('@infra/http/api', () => ({
//     api: require('@mocks/apiMock').createApiMock(),
//   }));
//
// Os repositórios só usam api.get() — os demais métodos do axios não
// precisam existir aqui.

export function createApiMock() {
  return {
    get: jest.fn(),
  };
}
