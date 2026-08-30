// camada: repositories — mapeia DTO(TMDB) ↔ entidade de domínio.

import { Movie } from '@domain/entities/movie';
import { MovieDto } from './dto/movieDto';

export function toDomain(dto: MovieDto): Movie {
  return {
    id: dto.id,
    title: dto.title,
    posterPath: dto.poster_path,
    overview: dto.overview ?? '',
    voteAverage: dto.vote_average ?? 0,
    releaseYear: dto.release_date && dto.release_date.length >= 4 ? dto.release_date.slice(0, 4) : null,
    genres: dto.genres?.map(genre => genre.name) ?? [],
  };
}
