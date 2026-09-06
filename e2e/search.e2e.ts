// camada: E2E — cobre o fluxo de busca com debounce (o hook useSearch espera
// ~400ms depois de parar de digitar antes de disparar a query).

describe('Buscar', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('busca um filme por título e mostra o resultado', async () => {
    await element(by.text('Buscar')).tap();

    const input = element(by.id('search-input'));
    await waitFor(input).toBeVisible().withTimeout(10000);
    await input.typeText('Matrix');

    await waitFor(element(by.id('search-list')))
      .toBeVisible()
      .withTimeout(15000);
  });

  it('mostra o estado vazio para uma busca sem resultado', async () => {
    await element(by.text('Buscar')).tap();

    const input = element(by.id('search-input'));
    await waitFor(input).toBeVisible().withTimeout(10000);
    await input.typeText('asdkjhaskjdhaskjdhaskjd');

    await waitFor(element(by.id('state-empty')))
      .toBeVisible()
      .withTimeout(15000);
  });
});
