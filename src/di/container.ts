// camada: di — o único lugar autorizado a conhecer domain e repository ao
// mesmo tempo (que por sua vez conhece data e infra). É aqui que a
// arquitetura de 6 camadas é "montada": presentation ──► domain ◄── repository
// ──► data ──► infra.

import { GetFavorites } from '@domain/usecases/getFavorites';
import { GetMovieDetails } from '@domain/usecases/getMovieDetails';
import { GetPopularMovies } from '@domain/usecases/getPopularMovies';
import { ObserveIsFavorite } from '@domain/usecases/observeIsFavorite';
import { SearchMovies } from '@domain/usecases/searchMovies';
import { ToggleFavorite } from '@domain/usecases/toggleFavorite';
import { favoritesRepository } from '@repository/favoritesRepository';
import { moviesRepository } from '@repository/moviesRepository';

export const container = {
  getPopularMovies: GetPopularMovies(moviesRepository),
  searchMovies: SearchMovies(moviesRepository),
  getMovieDetails: GetMovieDetails(moviesRepository),
  toggleFavorite: ToggleFavorite(favoritesRepository),
  getFavorites: GetFavorites(favoritesRepository),
  observeIsFavorite: ObserveIsFavorite(favoritesRepository),
};
