// camada: domain — não conhece framework, rede nem banco.
//
// toggle recebe o Movie inteiro (e não só o id) para permitir persistir uma
// cópia local completa do filme — é isso que faz a tela de favoritos
// funcionar 100% offline, sem depender de uma nova chamada de rede.

import { Movie } from '@domain/entities/movie';

export interface FavoritesRepository {
  getAll(): Movie[];
  toggle(movie: Movie): void;
  isFavorite(id: number): boolean;
}
