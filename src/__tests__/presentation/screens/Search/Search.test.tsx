import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchScreen } from '@presentation/screens/Search';
import { container } from '@di/container';
import { Movie } from '@domain/entities/movie';

jest.mock('@di/container', () => ({
  container: require('@mocks/containerMock').createContainerMock(),
}));

const mockedContainer = container as unknown as {
  searchMovies: jest.Mock;
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
      <SearchScreen />
    </QueryClientProvider>,
  );
}

describe('SearchScreen', () => {
  beforeEach(() => {
    mockedContainer.searchMovies.mockReset();
    mockedContainer.toggleFavorite.mockReset();
  });

  it('mostra a dica inicial antes de digitar', async () => {
    const { getByText } = await renderScreen();
    expect(getByText('Buscar filmes')).toBeTruthy();
  });

  it('busca e mostra os resultados, e favorita ao tocar no coração', async () => {
    mockedContainer.searchMovies.mockResolvedValue([movie]);
    const { getByPlaceholderText, getByText } = await renderScreen();

    fireEvent.changeText(getByPlaceholderText('Título do filme'), 'matrix');

    await waitFor(() => expect(getByText('Matrix')).toBeTruthy(), { timeout: 2000 });

    fireEvent.press(getByText('♡'));
    expect(mockedContainer.toggleFavorite).toHaveBeenCalledWith(movie);
  });

  it('mostra estado de erro com botão de tentar novamente', async () => {
    mockedContainer.searchMovies.mockRejectedValue(new Error('offline'));
    const { getByPlaceholderText, getByText } = await renderScreen();

    fireEvent.changeText(getByPlaceholderText('Título do filme'), 'matrix');

    await waitFor(() => expect(getByText('offline')).toBeTruthy(), { timeout: 2000 });
    fireEvent.press(getByText('Tentar novamente'));
  });

  it('mostra estado vazio quando a busca não encontra resultados', async () => {
    mockedContainer.searchMovies.mockResolvedValue([]);
    const { getByPlaceholderText, getByText } = await renderScreen();

    fireEvent.changeText(getByPlaceholderText('Título do filme'), 'inexistente');

    await waitFor(() => expect(getByText('Nada por aqui')).toBeTruthy(), { timeout: 2000 });
  });

  it('cancela a busca anterior ao digitar rapidamente (debounce)', async () => {
    mockedContainer.searchMovies.mockResolvedValue([movie]);
    const { getByPlaceholderText, getByText } = await renderScreen();

    const input = getByPlaceholderText('Título do filme');
    fireEvent.changeText(input, 'ma');
    fireEvent.changeText(input, 'matrix');

    await waitFor(() => expect(getByText('Matrix')).toBeTruthy(), { timeout: 2000 });
    expect(mockedContainer.searchMovies).toHaveBeenCalledTimes(1);
    expect(mockedContainer.searchMovies).toHaveBeenCalledWith('matrix', 1);
  });
});
