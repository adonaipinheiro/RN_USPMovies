// camada: infra — plumbing técnica genérica, não conhece o domínio.

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
