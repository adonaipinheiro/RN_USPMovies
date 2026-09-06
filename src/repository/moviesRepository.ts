// camada: repository — implementa o contrato do domain, orquestrando a fonte
// de dados remota (data) e o cache local (infra): decide a política de
// cache-first / fallback offline. Não conhece o formato cru da TMDB
// diretamente — usa o DTO e o mapper expostos por @data para isso.

import { Movie } from '@domain/entities/movie';
import { MoviesRepository } from '@domain/repositories/moviesRepository';
import { MovieDto, MoviesPageDto } from '@data/remote/dto/movieDto';
import { toDomain } from '@data/mapper/movieMapper';
import { api } from '@infra/http/api';
import { getObject, setObject } from '@infra/storage/mmkv';

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
