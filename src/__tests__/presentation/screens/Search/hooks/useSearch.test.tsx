import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSearch } from '@presentation/screens/Search/hooks/useSearch';
import { container } from '@di/container';
import { Movie } from '@domain/entities/movie';

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

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const movie: Movie = {
  id: 1,
  title: 'Matrix',
  posterPath: null,
  overview: '',
  voteAverage: 8,
  releaseYear: '1999',
  genres: [],
};

describe('useSearch', () => {
  beforeEach(() => {
    mockedContainer.toggleFavorite.mockReset();
  });

  it('não busca nada enquanto a query está vazia', async () => {
    const { result } = await renderHook(() => useSearch(), { wrapper: createWrapper() });

    expect(result.current.isSearching).toBe(false);
    expect(result.current.state).toEqual({ type: 'empty' });
  });

  it('toggleFavorite delega para container.toggleFavorite', async () => {
    const { result } = await renderHook(() => useSearch(), { wrapper: createWrapper() });

    result.current.toggleFavorite(movie);

    expect(mockedContainer.toggleFavorite).toHaveBeenCalledWith(movie);
  });
});
