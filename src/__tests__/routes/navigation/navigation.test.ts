import { navigation, navigationRef } from '@routes/navigation/navigation';

describe('navigation', () => {
  const dispatch = jest.fn();
  const goBack = jest.fn();
  let canGoBackValue = true;

  beforeEach(() => {
    dispatch.mockReset();
    goBack.mockReset();
    canGoBackValue = true;
    (navigationRef as { current: unknown }).current = {
      dispatch,
      goBack,
      canGoBack: () => canGoBackValue,
    };
  });

  afterEach(() => {
    (navigationRef as { current: unknown }).current = null;
  });

  it('replace despacha uma StackActions.replace', () => {
    navigation.replace('Detail', { movieId: 1 });
    expect(dispatch).toHaveBeenCalledTimes(1);
  });

  it('push despacha uma StackActions.push', () => {
    navigation.push('Detail', { movieId: 1 });
    expect(dispatch).toHaveBeenCalledTimes(1);
  });

  it('goBack chama goBack quando é possível voltar', () => {
    navigation.goBack();
    expect(goBack).toHaveBeenCalledTimes(1);
  });

  it('goBack não faz nada quando não é possível voltar', () => {
    canGoBackValue = false;
    navigation.goBack();
    expect(goBack).not.toHaveBeenCalled();
  });

  it('não quebra quando não há NavigationContainer montado (current é null)', () => {
    (navigationRef as { current: unknown }).current = null;

    expect(() => navigation.push('Detail', { movieId: 1 })).not.toThrow();
    expect(() => navigation.replace('Detail', { movieId: 1 })).not.toThrow();
    expect(() => navigation.goBack()).not.toThrow();
  });
});
