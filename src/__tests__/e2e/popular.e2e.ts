// camada: E2E — roda o app de verdade (build nativo) num simulador/emulador,
// sem mockar nada. Por isso depende de um TMDB_ACCESS_TOKEN válido em .env
// (mesmo requisito do app "de verdade") e de rede disponível no device.

describe('Populares', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('mostra a lista de populares e abre o detalhe ao tocar num filme', async () => {
    await waitFor(element(by.id('popular-list')))
      .toBeVisible()
      .withTimeout(15000);

    const firstCard = element(by.id('movie-card')).atIndex(0);
    await waitFor(firstCard).toBeVisible().withTimeout(15000);
    await firstCard.tap();

    await waitFor(element(by.id('back-button')))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id('back-button')).tap();
    await waitFor(element(by.id('popular-list')))
      .toBeVisible()
      .withTimeout(10000);
  });
});
