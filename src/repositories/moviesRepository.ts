// camada: repositories — implementa o contrato do domínio usando o Infra.

import { Movie } from '@domain/entities/movie';
import { MoviesRepository } from '@domain/repositories/moviesRepository';
import { api } from '@infra/http/api';
import { getObject, setObject } from '@infra/storage/mmkv';
import { MovieDto, MoviesPageDto } from './dto/movieDto';
import { toDomain } from './movieMapper';

const POPULAR_CACHE_KEY = 'cache:popular';

export const moviesRepository: MoviesRepository = {
  async getPopular(page) {
    try {
      const { data } = await api.get<MoviesPageDto>('/movie/popular', { params: { page } });
      const movies = data.results.map(toDomain);
      if (page === 1) {
        setObject(POPULAR_CACHE_KEY, movies);
      }
      return movies;
    } catch (error) {
      // F6: sem rede na primeira página, cai para o cache local.
      if (page === 1) {
        const cached = getObject<Movie[]>(POPULAR_CACHE_KEY);
        if (cached && cached.length > 0) {
          return cached;
        }
      }
      throw error;
    }
  },

  async search(query, page) {
    const { data } = await api.get<MoviesPageDto>('/search/movie', { params: { query, page } });
    return data.results.map(toDomain);
  },

  async getDetails(id) {
    const { data } = await api.get<MovieDto>(`/movie/${id}`);
    return toDomain(data);
  },
};
