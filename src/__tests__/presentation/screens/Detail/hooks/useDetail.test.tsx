import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDetail } from '@presentation/screens/Detail/hooks/useDetail';
import { container } from '@di/container';
import { Movie } from '@domain/entities/movie';

jest.mock('@react-navigation/native', () =>
  require('@mocks/navigationMock').createNavigationMock({ movieId: 42 }),
);

jest.mock('@di/container', () => ({
  container: require('@mocks/containerMock').createContainerMock(),
}));

const mockedContainer = container as unknown as {
  getMovieDetails: jest.Mock;
  toggleFavorite: jest.Mock;
};

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const movie: Movie = {
  id: 42,
  title: 'Matrix',
  posterPath: null,
  overview: '',
  voteAverage: 8,
  releaseYear: '1999',
  genres: [],
};

describe('useDetail', () => {
  beforeEach(() => {
    mockedContainer.getMovieDetails.mockReset();
    mockedContainer.toggleFavorite.mockReset();
  });

  it('começa em "loading" e carrega os detalhes do filme da rota', async () => {
    mockedContainer.getMovieDetails.mockResolvedValue(movie);

    const { result } = await renderHook(() => useDetail(), { wrapper: createWrapper() });
    expect(result.current.state.type).toBe('loading');

    await waitFor(() => expect(result.current.state.type).toBe('data'));
    expect(mockedContainer.getMovieDetails).toHaveBeenCalledWith(42);
  });

  it('expõe "error" quando a busca falha, e retry tenta novamente', async () => {
    mockedContainer.getMovieDetails.mockRejectedValueOnce(new Error('offline'));
    const { result } = await renderHook(() => useDetail(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.state.type).toBe('error'));

    mockedContainer.getMovieDetails.mockResolvedValueOnce(movie);
    await result.current.retry();

    await waitFor(() => expect(result.current.state.type).toBe('data'));
  });

  it('toggleFavorite não faz nada enquanto o filme não carregou', async () => {
    mockedContainer.getMovieDetails.mockImplementation(() => new Promise(() => {}));
    const { result } = await renderHook(() => useDetail(), { wrapper: createWrapper() });

    result.current.toggleFavorite();

    expect(mockedContainer.toggleFavorite).not.toHaveBeenCalled();
  });

  it('toggleFavorite delega para container.toggleFavorite quando o filme já carregou', async () => {
    mockedContainer.getMovieDetails.mockResolvedValue(movie);
    const { result } = await renderHook(() => useDetail(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.state.type).toBe('data'));

    result.current.toggleFavorite();

    expect(mockedContainer.toggleFavorite).toHaveBeenCalledWith(movie);
  });
});
