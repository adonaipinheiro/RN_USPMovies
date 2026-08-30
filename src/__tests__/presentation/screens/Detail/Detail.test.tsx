import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { DetailScreen } from '@presentation/screens/Detail';
import { container } from '@di/container';
import { createMovie } from '@mocks/movieFixture';
import { createQueryClientWrapper } from '@mocks/queryClientWrapper';

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

const movie = createMovie({
  posterPath: '/p.jpg',
  overview: 'Sinopse',
  genres: ['Ação', 'Ficção'],
});

async function renderScreen() {
  const Wrapper = createQueryClientWrapper();
  return render(
    <Wrapper>
      <DetailScreen />
    </Wrapper>,
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

  it('não renderiza o ano de lançamento quando ausente', async () => {
    mockedContainer.getMovieDetails.mockResolvedValue({ ...movie, releaseYear: '' });
    const { getByText, queryByText } = await renderScreen();

    await waitFor(() => expect(getByText('Matrix')).toBeTruthy());
    expect(queryByText(/1999/)).toBeNull();
  });
});
