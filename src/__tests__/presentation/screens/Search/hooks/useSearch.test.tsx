import { renderHook } from '@testing-library/react-native';
import { useSearch } from '@presentation/screens/Search/hooks/useSearch';
import { container } from '@di/container';
import { createMovie } from '@mocks/movieFixture';
import { createQueryClientWrapper } from '@mocks/queryClientWrapper';

// Os cenários de debounce/erro/vazio (que dependem de timers reais e do ciclo
// de act() do React) são cobertos de forma mais estável pelo teste da tela
// (Search.test.tsx), via fireEvent + waitFor. Aqui testamos só o que não
// depende de tempo.

jest.mock('@di/container', () => ({
  container: require('@mocks/containerMock').createContainerMock(),
}));

const mockedContainer = container as unknown as {
  toggleFavorite: jest.Mock;
};

const movie = createMovie();

describe('useSearch', () => {
  beforeEach(() => {
    mockedContainer.toggleFavorite.mockReset();
  });

  it('não busca nada enquanto a query está vazia', async () => {
    const { result } = await renderHook(() => useSearch(), { wrapper: createQueryClientWrapper() });

    expect(result.current.isSearching).toBe(false);
    expect(result.current.state).toEqual({ type: 'empty' });
  });

  it('toggleFavorite delega para container.toggleFavorite', async () => {
    const { result } = await renderHook(() => useSearch(), { wrapper: createQueryClientWrapper() });

    result.current.toggleFavorite(movie);

    expect(mockedContainer.toggleFavorite).toHaveBeenCalledWith(movie);
  });
});
