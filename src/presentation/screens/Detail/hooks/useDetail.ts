// camada: presentation — o hook concentra a lógica; a View é burra.

import { useQuery } from '@tanstack/react-query';
import { RouteProp, useRoute } from '@react-navigation/native';
import { container } from '@di/container';
import { Movie } from '@domain/entities/movie';
import { UiState } from '@presentation/state/uiState';
import { useIsFavorite } from '@store/useFavoritesStore';
import type { MainStackParams } from '@routes/stack/MainStack.routes';

type DetailRouteProp = RouteProp<MainStackParams, 'Detail'>;

export function useDetail() {
  const route = useRoute<DetailRouteProp>();
  const movieId = route.params.movieId;

  const detailQuery = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => container.getMovieDetails(movieId),
  });

  // Sem estado "empty" aqui: o React Query nunca resolve `data` como
  // undefined em caso de sucesso (é erro de contrato lançar isso da
  // queryFn) — só existem os estados loading/error/data para um detalhe.
  const state: UiState<Movie> = detailQuery.isLoading
    ? { type: 'loading' }
    : detailQuery.isError
      ? { type: 'error', message: (detailQuery.error as Error).message }
      : { type: 'data', value: detailQuery.data as Movie };

  const isFavorite = useIsFavorite(movieId);

  return {
    state,
    isFavorite,
    retry: () => detailQuery.refetch(),
    toggleFavorite: () => {
      if (detailQuery.data) {
        container.toggleFavorite(detailQuery.data);
      }
    },
  };
}
