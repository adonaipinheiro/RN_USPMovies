import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DetailScreen } from '@presentation/screens/Detail';
import { container } from '@di/container';
import { Movie } from '@domain/entities/movie';

jest.mock('@react-navigation/native', () =>
  require('@mocks/navigationMock').createNavigationMock({ movieId: 1 }),
);

jest.mock('@di/container', () => ({
  container: require('@mocks/containerMock').createContainerMock(),
}));

const mockedContainer = container as unknown as {
  getMovieDetails: jest.Mock;
  toggleFavorite: jest.Mock;
};

const movie: Movie = {
  id: 1,
  title: 'Matrix',
  posterPath: '/p.jpg',
  overview: 'Sinopse',
  voteAverage: 8,
  releaseYear: '1999',
  genres: ['Ação', 'Ficção'],
};

async function renderScreen() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <DetailScreen />
    </QueryClientProvider>,
  );
}

describe('DetailScreen', () => {
  beforeEach(() => {
    mockedContainer.getMovieDetails.mockReset();
    mockedContainer.toggleFavorite.mockReset();
  });

  it('renderiza os detalhes do filme, incluindo gêneros', async () => {
    mockedContainer.getMovieDetails.mockResolvedValue(movie);
    const { getByText } = await renderScreen();

    await waitFor(() => expect(getByText('Matrix')).toBeTruthy());
    expect(getByText('Ação')).toBeTruthy();
    expect(getByText('Sinopse')).toBeTruthy();
  });

  it('favorita o filme ao tocar no coração do cabeçalho', async () => {
    mockedContainer.getMovieDetails.mockResolvedValue(movie);
    const { getByText } = await renderScreen();

    await waitFor(() => expect(getByText('Matrix')).toBeTruthy());
    fireEvent.press(getByText('♡'));

    expect(mockedContainer.toggleFavorite).toHaveBeenCalledWith(movie);
  });

  it('não quebra ao tocar em "Voltar"', async () => {
    mockedContainer.getMovieDetails.mockResolvedValue(movie);
    const { getByText } = await renderScreen();

    await waitFor(() => expect(getByText('Matrix')).toBeTruthy());
    expect(() => fireEvent.press(getByText('‹ Voltar'))).not.toThrow();
  });

  it('não renderiza a lista de gêneros nem o pôster quando ausentes', async () => {
    mockedContainer.getMovieDetails.mockResolvedValue({ ...movie, genres: [], posterPath: null });
    const { getByText, queryByText } = await renderScreen();

    await waitFor(() => expect(getByText('Matrix')).toBeTruthy());
    expect(queryByText('Ação')).toBeNull();
  });
});
