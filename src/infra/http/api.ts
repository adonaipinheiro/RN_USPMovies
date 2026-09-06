// camada: infra — plumbing técnica 100% genérica: instância axios com
// baseURL/headers/interceptors. Não sabe o que é um "filme" nem conhece
// endpoints específicos da TMDB (isso é responsabilidade de @data) — por
// isso nada deste arquivo foi movido para data/ na separação em 6 camadas.
// O único dado específico do produto aqui é a própria baseURL da TMDB,
// necessária para o client funcionar; os endpoints (/movie/popular,
// /search/movie, etc.) ficam no repository, que hoje atua também como fonte
// de dados remota.

import axios from 'axios';
import { TMDB_ACCESS_TOKEN } from '@env';

export const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${TMDB_ACCESS_TOKEN}`;
  return config;
});

// "monitors" de request/response em __DEV__, análogo aos interceptors do ImpactaRN.
if (__DEV__) {
  api.interceptors.request.use(config => {
    console.log(`[TMDB] → ${(config.method ?? 'get').toUpperCase()} ${config.url}`, config.params ?? '');
    return config;
  });

  api.interceptors.response.use(
    response => {
      console.log(`[TMDB] ← ${response.status} ${response.config.url}`);
      return response;
    },
    error => {
      console.log(`[TMDB] ✕ ${error.response?.status ?? '???'} ${error.config?.url ?? ''}`);
      return Promise.reject(error);
    },
  );
}
