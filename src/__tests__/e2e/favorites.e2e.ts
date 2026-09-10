// camada: E2E — cobre F4/F5: favoritar na lista de populares e ver o filme
// refletido na aba Favoritos (persistência local via MMKV, sem rede).

describe('Favoritos', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('favorita um filme na lista de populares e o vê na aba Favoritos', async () => {
    await waitFor(element(by.id('popular-list')))
      .toBeVisible()
      .withTimeout(15000);

    const firstFavButton = element(by.id('fav-button')).atIndex(0);
    await waitFor(firstFavButton).toBeVisible().withTimeout(15000);
    await firstFavButton.tap();

    // Mesma razão do spec de busca: aba por testID, e toExist (não
    // toBeVisible) porque a view do tabBarTestID cobre também o inset de
    // gestos e não passa na régua de 75% do Detox.
    await waitFor(element(by.id('tab-favorites')))
      .toExist()
      .withTimeout(15000);
    await element(by.id('tab-favorites')).tap();

    await waitFor(element(by.id('favorites-list')))
      .toBeVisible()
      .withTimeout(10000);
    await waitFor(element(by.id('movie-card')).atIndex(0))
      .toBeVisible()
      .withTimeout(10000);
  });
});
