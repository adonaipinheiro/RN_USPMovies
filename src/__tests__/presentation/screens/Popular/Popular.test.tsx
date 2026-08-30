import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PopularScreen } from '@presentation/screens/Popular';
import { container } from '@di/container';
import { Movie } from '@domain/entities/movie';

jest.mock('@di/container', () => ({
  container: require('@mocks/containerMock').createContainerMock(),
}));

const mockedContainer = container as unknown as {
  getPopularMovies: jest.Mock;
  toggleFavorite: jest.Mock;
};

const movie: Movie = {
  id: 1,
  title: 'Matrix',
  posterPath: null,
  overview: 'Sinopse',
  voteAverage: 8,
  releaseYear: '1999',
  genres: [],
};

async function renderScreen() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <PopularScreen />
    </QueryClientProvider>,
  );
}

describe('PopularScreen', () => {
  beforeEach(() => {
    mockedContainer.getPopularMovies.mockReset();
    mockedContainer.toggleFavorite.mockReset();
  });

  it('renderiza a lista de filmes populares', async () => {
    mockedContainer.getPopularMovies.mockResolvedValue([movie]);
    const { getByText } = await renderScreen();

    await waitFor(() => expect(getByText('Matrix')).toBeTruthy());
  });

  it('favorita um filme ao tocar no coração do card', async () => {
    mockedContainer.getPopularMovies.mockResolvedValue([movie]);
    const { getByText } = await renderScreen();

    await waitFor(() => expect(getByText('Matrix')).toBeTruthy());
    fireEvent.press(getByText('♡'));

    expect(mockedContainer.toggleFavorite).toHaveBeenCalledWith(movie);
  });

  it('mostra estado de erro com botão de tentar novamente', async () => {
    mockedContainer.getPopularMovies.mockRejectedValue(new Error('offline'));
    const { getByText } = await renderScreen();

    await waitFor(() => expect(getByText('offline')).toBeTruthy());
    fireEvent.press(getByText('Tentar novamente'));

    expect(mockedContainer.getPopularMovies).toHaveBeenCalledTimes(2);
  });
});
