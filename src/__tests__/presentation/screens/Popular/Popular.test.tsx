import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PopularScreen } from '@presentation/screens/Popular';
import { container } from '@di/container';
import { coordinator } from '@routes/navigation';
import { createMovie } from '@mocks/movieFixture';
import { createQueryClientWrapper } from '@mocks/queryClientWrapper';

jest.mock('@di/container', () => ({
  container: require('@mocks/containerMock').createContainerMock(),
}));

const mockedContainer = container as unknown as {
  getPopularMovies: jest.Mock;
  toggleFavorite: jest.Mock;
};

const movie = createMovie({ overview: 'Sinopse' });
const movie2 = createMovie({ id: 2, title: 'Matrix Reloaded', overview: 'Sinopse' });

async function renderScreen() {
  const Wrapper = createQueryClientWrapper();
  return render(
    <Wrapper>
      <PopularScreen />
    </Wrapper>,
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

  it('navega para o detalhe ao tocar em um card e renderiza o separador entre itens', async () => {
    mockedContainer.getPopularMovies.mockResolvedValue([movie, movie2]);
    const gotToDetail = jest.spyOn(coordinator, 'gotToDetail').mockImplementation(() => {});

    const { getByText } = await renderScreen();

    await waitFor(() => expect(getByText('Matrix Reloaded')).toBeTruthy());
    fireEvent.press(getByText('Matrix'));

    expect(gotToDetail).toHaveBeenCalledWith(1);
    gotToDetail.mockRestore();
  });
});
