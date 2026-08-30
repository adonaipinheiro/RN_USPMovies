import { moviesRepository } from '@repositories/moviesRepository';
import { api } from '@infra/http/api';
import { storage } from '@infra/storage/mmkv';

jest.mock('@infra/http/api', () => ({
  api: { get: jest.fn() },
}));

const mockedApi = api as unknown as { get: jest.Mock };

describe('moviesRepository', () => {
  beforeEach(() => {
    storage.clearAll();
    mockedApi.get.mockReset();
  });

  it('getPopular mapeia o DTO da TMDB para a entidade de domínio', async () => {
    mockedApi.get.mockResolvedValue({
      data: {
        page: 1,
        results: [
          {
            id: 1,
            title: 'Matrix',
            poster_path: '/m.jpg',
            vote_average: 8,
            release_date: '1999-01-01',
          },
        ],
      },
    });

    const movies = await moviesRepository.getPopular(1);

    expect(mockedApi.get).toHaveBeenCalledWith('/movie/popular', { params: { page: 1 } });
    expect(movies).toEqual([
      { id: 1, title: 'Matrix', posterPath: '/m.jpg', overview: '', voteAverage: 8, releaseYear: '1999', genres: [] },
    ]);
  });

  it('F6: quando a página 1 falha, cai para o cache local da última busca bem-sucedida', async () => {
    mockedApi.get.mockResolvedValueOnce({
      data: { page: 1, results: [{ id: 1, title: 'Matrix', poster_path: null }] },
    });
    await moviesRepository.getPopular(1); // popula o cache

    mockedApi.get.mockRejectedValueOnce(new Error('offline'));
    const cached = await moviesRepository.getPopular(1);

    expect(cached).toHaveLength(1);
    expect(cached[0].title).toBe('Matrix');
  });

  it('propaga o erro quando falha e não existe cache', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('offline'));

    await expect(moviesRepository.getPopular(1)).rejects.toThrow('offline');
  });

  it('não usa cache para páginas além da primeira', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('offline'));

    await expect(moviesRepository.getPopular(2)).rejects.toThrow('offline');
  });

  it('search delega para /search/movie com query e página', async () => {
    mockedApi.get.mockResolvedValue({ data: { page: 1, results: [] } });

    await moviesRepository.search('matrix', 2);

    expect(mockedApi.get).toHaveBeenCalledWith('/search/movie', { params: { query: 'matrix', page: 2 } });
  });

  it('getDetails delega para /movie/{id}', async () => {
    mockedApi.get.mockResolvedValue({ data: { id: 5, title: 'Detalhe', poster_path: null } });

    const movie = await moviesRepository.getDetails(5);

    expect(mockedApi.get).toHaveBeenCalledWith('/movie/5');
    expect(movie.id).toBe(5);
  });
});
