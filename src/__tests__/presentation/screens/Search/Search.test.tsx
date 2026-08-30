import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SearchScreen } from '@presentation/screens/Search';
import { container } from '@di/container';
import { coordinator } from '@routes/navigation';
import { createMovie } from '@mocks/movieFixture';
import { createQueryClientWrapper } from '@mocks/queryClientWrapper';

jest.mock('@di/container', () => ({
  container: require('@mocks/containerMock').createContainerMock(),
}));

const mockedContainer = container as unknown as {
  searchMovies: jest.Mock;
  toggleFavorite: jest.Mock;
};

const movie = createMovie({ overview: 'Sinopse' });
const movie2 = createMovie({ id: 2, title: 'Matrix Reloaded', overview: 'Sinopse' });

async function renderScreen() {
  const Wrapper = createQueryClientWrapper();
  return render(
    <Wrapper>
      <SearchScreen />
    </Wrapper>,
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

  it('navega para o detalhe ao tocar em um card e renderiza o separador entre itens', async () => {
    mockedContainer.searchMovies.mockResolvedValue([movie, movie2]);
    const gotToDetail = jest.spyOn(coordinator, 'gotToDetail').mockImplementation(() => {});
    const { getByPlaceholderText, getByText } = await renderScreen();

    fireEvent.changeText(getByPlaceholderText('Título do filme'), 'matrix');

    await waitFor(() => expect(getByText('Matrix Reloaded')).toBeTruthy(), { timeout: 2000 });
    fireEvent.press(getByText('Matrix'));

    expect(gotToDetail).toHaveBeenCalledWith(1);
    gotToDetail.mockRestore();
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
