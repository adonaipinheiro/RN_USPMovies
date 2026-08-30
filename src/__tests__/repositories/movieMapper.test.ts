import { toDomain } from '@repositories/movieMapper';

describe('movieMapper', () => {
  it('mapeia um MovieDto completo para a entidade Movie', () => {
    const movie = toDomain({
      id: 1,
      title: 'Matrix',
      poster_path: '/poster.jpg',
      overview: 'Sinopse',
      vote_average: 8.7,
      release_date: '1999-03-31',
      genres: [
        { id: 1, name: 'Ação' },
        { id: 2, name: 'Ficção científica' },
      ],
    });

    expect(movie).toEqual({
      id: 1,
      title: 'Matrix',
      posterPath: '/poster.jpg',
      overview: 'Sinopse',
      voteAverage: 8.7,
      releaseYear: '1999',
      genres: ['Ação', 'Ficção científica'],
    });
  });

  it('usa valores padrão quando campos opcionais estão ausentes', () => {
    const movie = toDomain({ id: 2, title: 'Sem detalhes', poster_path: null });

    expect(movie).toEqual({
      id: 2,
      title: 'Sem detalhes',
      posterPath: null,
      overview: '',
      voteAverage: 0,
      releaseYear: null,
      genres: [],
    });
  });
});
