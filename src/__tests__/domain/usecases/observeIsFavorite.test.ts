import { ObserveIsFavorite } from '@domain/usecases/observeIsFavorite';
import { createFavoritesRepositoryMock } from '@mocks/favoritesRepositoryMock';

describe('ObserveIsFavorite', () => {
  it('delega para repository.isFavorite com o id informado', () => {
    const repository = createFavoritesRepositoryMock();
    repository.isFavorite.mockReturnValue(true);

    const observeIsFavorite = ObserveIsFavorite(repository);
    const result = observeIsFavorite(7);

    expect(repository.isFavorite).toHaveBeenCalledWith(7);
    expect(result).toBe(true);
  });
});
