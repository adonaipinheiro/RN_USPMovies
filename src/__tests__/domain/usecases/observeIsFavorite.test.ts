import { ObserveIsFavorite } from '@domain/usecases/observeIsFavorite';
import { FavoritesRepository } from '@domain/repositories/favoritesRepository';

describe('ObserveIsFavorite', () => {
  it('delega para repository.isFavorite com o id informado', () => {
    const repository: FavoritesRepository = {
      getAll: jest.fn(),
      toggle: jest.fn(),
      isFavorite: jest.fn().mockReturnValue(true),
    };

    const observeIsFavorite = ObserveIsFavorite(repository);
    const result = observeIsFavorite(7);

    expect(repository.isFavorite).toHaveBeenCalledWith(7);
    expect(result).toBe(true);
  });
});
