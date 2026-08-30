// camada: presentation — o hook concentra a lógica; a View é burra.

import { useInfiniteQuery } from '@tanstack/react-query';
import { container } from '@di/container';
import { Movie } from '@domain/entities/movie';
import { UiState } from '@presentation/state/uiState';

export function usePopular() {
  const query = useInfiniteQuery({
    queryKey: ['popular'],
    queryFn: ({ pageParam }) => container.getPopularMovies(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => (lastPage.length > 0 ? allPages.length + 1 : undefined),
  });

  const movies: Movie[] = query.data?.pages.flat() ?? [];

  const state: UiState<Movie[]> = query.isPending
    ? { type: 'loading' }
    : query.isError
      ? { type: 'error', message: (query.error as Error).message }
      : movies.length === 0
        ? { type: 'empty' }
        : { type: 'data', value: movies };

  return {
    state,
    reload: () => query.refetch(),
    loadMore: () => {
      if (query.hasNextPage && !query.isFetchingNextPage) {
        return query.fetchNextPage();
      }
      return undefined;
    },
    toggleFavorite: (movie: Movie) => container.toggleFavorite(movie),
  };
}
