// camada: presentation — o hook concentra a lógica; a View é burra.

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { container } from '@di/container';
import { Movie } from '@domain/entities/movie';
import { UiState } from '@presentation/state/uiState';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const trimmed = query.trim();
    const timeout = setTimeout(() => setDebouncedQuery(trimmed), 400);
    return () => clearTimeout(timeout);
  }, [query]);

  const searchQuery = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => container.searchMovies(debouncedQuery, 1),
    enabled: debouncedQuery.length > 0,
  });

  const movies: Movie[] = searchQuery.data ?? [];

  const state: UiState<Movie[]> = searchQuery.isLoading
    ? { type: 'loading' }
    : searchQuery.isError
      ? { type: 'error', message: (searchQuery.error as Error).message }
      : movies.length === 0
        ? { type: 'empty' }
        : { type: 'data', value: movies };

  return {
    query,
    setQuery,
    isSearching: debouncedQuery.length > 0,
    state,
    retry: () => searchQuery.refetch(),
    toggleFavorite: (movie: Movie) => container.toggleFavorite(movie),
  };
}
