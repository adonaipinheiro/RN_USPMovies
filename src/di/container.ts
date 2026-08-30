// camada: DI — o único lugar autorizado a conhecer domain e repositories ao
// mesmo tempo. É aqui que a arquitetura é "montada".

import { GetFavorites } from '@domain/usecases/getFavorites';
import { GetMovieDetails } from '@domain/usecases/getMovieDetails';
import { GetPopularMovies } from '@domain/usecases/getPopularMovies';
import { ObserveIsFavorite } from '@domain/usecases/observeIsFavorite';
import { SearchMovies } from '@domain/usecases/searchMovies';
import { ToggleFavorite } from '@domain/usecases/toggleFavorite';
import { favoritesRepository } from '@repositories/favoritesRepository';
import { moviesRepository } from '@repositories/moviesRepository';

export const container = {
  getPopularMovies: GetPopularMovies(moviesRepository),
  searchMovies: SearchMovies(moviesRepository),
  getMovieDetails: GetMovieDetails(moviesRepository),
  toggleFavorite: ToggleFavorite(favoritesRepository),
  getFavorites: GetFavorites(favoritesRepository),
  observeIsFavorite: ObserveIsFavorite(favoritesRepository),
};
