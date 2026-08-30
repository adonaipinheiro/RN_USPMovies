import { renderHook, waitFor, act } from '@testing-library/react-native';
import { usePopular } from '@presentation/screens/Popular/hooks/usePopular';
import { container } from '@di/container';
import { createMovie } from '@mocks/movieFixture';
import { createQueryClientWrapper } from '@mocks/queryClientWrapper';

jest.mock('@di/container', () => ({
  container: require('@mocks/containerMock').createContainerMock(),
}));

const mockedContainer = container as unknown as {
  getPopularMovies: jest.Mock;
  toggleFavorite: jest.Mock;
};

const movie = createMovie();

describe('usePopular', () => {
  beforeEach(() => {
    mockedContainer.getPopularMovies.mockReset();
    mockedContainer.toggleFavorite.mockReset();
  });

  it('começa em "loading" e carrega a primeira página', async () => {
    mockedContainer.getPopularMovies.mockResolvedValue([movie]);

    const { result } = await renderHook(() => usePopular(), { wrapper: createQueryClientWrapper() });

    expect(result.current.state.type).toBe('loading');

    await waitFor(() => expect(result.current.state.type).toBe('data'));
    expect(mockedContainer.getPopularMovies).toHaveBeenCalledWith(1);
    if (result.current.state.type === 'data') {
      expect(result.current.state.value).toEqual([movie]);
    }
  });

  it('expõe estado "empty" quando a primeira página vem vazia', async () => {
    mockedContainer.getPopularMovies.mockResolvedValue([]);

    const { result } = await renderHook(() => usePopular(), { wrapper: createQueryClientWrapper() });

    await waitFor(() => expect(result.current.state.type).toBe('empty'));
  });

  it('expõe estado "error" quando a busca falha', async () => {
    mockedContainer.getPopularMovies.mockRejectedValue(new Error('offline'));

    const { result } = await renderHook(() => usePopular(), { wrapper: createQueryClientWrapper() });

    await waitFor(() => expect(result.current.state.type).toBe('error'));
  });

  it('reload chama a primeira página novamente', async () => {
    mockedContainer.getPopularMovies.mockResolvedValue([movie]);
    const { result } = await renderHook(() => usePopular(), { wrapper: createQueryClientWrapper() });
    await waitFor(() => expect(result.current.state.type).toBe('data'));

    await act(async () => {
      await result.current.reload();
    });

    expect(mockedContainer.getPopularMovies).toHaveBeenCalledTimes(2);
  });

  it('loadMore busca a próxima página quando existe', async () => {
    mockedContainer.getPopularMovies.mockResolvedValueOnce([movie]).mockResolvedValueOnce([{ ...movie, id: 2 }]);

    const { result } = await renderHook(() => usePopular(), { wrapper: createQueryClientWrapper() });
    await waitFor(() => expect(result.current.state.type).toBe('data'));

    await act(async () => {
      await result.current.loadMore();
    });

    await waitFor(
      () => {
        if (result.current.state.type !== 'data' || result.current.state.value.length < 2) {
          throw new Error('esperando a segunda página chegar ao estado');
        }
      },
      { timeout: 2000 },
    );

    expect(mockedContainer.getPopularMovies).toHaveBeenCalledWith(2);
    if (result.current.state.type === 'data') {
      expect(result.current.state.value).toHaveLength(2);
    }
  });

  it('loadMore não busca mais páginas quando a última página veio vazia', async () => {
    // Da 2ª chamada em diante todo resultado é vazio: mesmo que uma chamada
    // "a mais" escape por uma corrida interna do React Query (ver comentário
    // abaixo), ela também recebe uma página vazia e converge do mesmo jeito.
    mockedContainer.getPopularMovies.mockResolvedValueOnce([movie]).mockResolvedValue([]);

    const { result } = await renderHook(() => usePopular(), { wrapper: createQueryClientWrapper() });
    await waitFor(() => expect(result.current.state.type).toBe('data'));

    await act(async () => {
      await result.current.loadMore();
    });
    expect(mockedContainer.getPopularMovies).toHaveBeenCalledTimes(2);

    // O React Query recalcula `hasNextPage` (getNextPageParam) de forma
    // assíncrona em relação à página vazia chegar no cache — geralmente no
    // mesmo tick, mas nem sempre no mesmo microtask da promise que
    // aguardamos acima. Uma espera real e generosa aqui é mais simples e
    // mais robusta do que tentar decidir o exato microtask certo: 100ms é
    // fartura de sobra para qualquer bookkeeping interno assentar.
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await act(async () => {
      await result.current.loadMore();
    });
    expect(mockedContainer.getPopularMovies).toHaveBeenCalledTimes(2);
  });

  it('toggleFavorite delega para container.toggleFavorite', async () => {
    mockedContainer.getPopularMovies.mockResolvedValue([]);
    const { result } = await renderHook(() => usePopular(), { wrapper: createQueryClientWrapper() });
    await waitFor(() => expect(result.current.state.type).toBe('empty'));

    result.current.toggleFavorite(movie);

    expect(mockedContainer.toggleFavorite).toHaveBeenCalledWith(movie);
  });
});
