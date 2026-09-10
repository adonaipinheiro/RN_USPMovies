// camada: E2E — cobre o fluxo de busca com debounce (o hook useSearch espera
// ~400ms depois de parar de digitar antes de disparar a query).

// A aba é selecionada por testID, não por texto: o label "Buscar" também é o
// título da tela de busca (matcher ambíguo), e logo depois do
// reloadReactNative a tab bar ainda não montou — daí o waitFor antes do tap.
// O wait é toExist, não toBeVisible: o que interessa aqui é "a tab bar já
// montou", e a view do tabBarTestID se estende pela área do inset de gestos,
// reprovando na régua de 75% de visibilidade do Detox mesmo com a aba
// perfeitamente clicável na tela.
async function tapSearchTab() {
  await waitFor(element(by.id('tab-search')))
    .toExist()
    .withTimeout(15000);
  await element(by.id('tab-search')).tap();
}

describe('Buscar', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('busca um filme por título e mostra o resultado', async () => {
    await tapSearchTab();

    const input = element(by.id('search-input'));
    await waitFor(input).toBeVisible().withTimeout(10000);
    // replaceText em vez de typeText: o typeText depende do IME do device, e
    // no emulador Android o teclado sobe com a barra flutuante de voz/colar e
    // engole as teclas. O replaceText escreve direto no campo e dispara o
    // onChangeText — que é exatamente o que o debounce do useSearch escuta.
    await input.replaceText('Matrix');

    // A FlatList ocupa toda a área abaixo do campo, e o teclado cobre a metade
    // de baixo dela; como o toBeVisible do Detox exige 75% do elemento na
    // tela, a lista inteira nunca passaria. Então: a lista precisa existir, e
    // a asserção de visibilidade vai no primeiro card, que fica acima do
    // teclado — é o que prova que o resultado da busca chegou na tela.
    await waitFor(element(by.id('search-list'))).toExist().withTimeout(15000);
    await waitFor(element(by.id('movie-card')).atIndex(0))
      .toBeVisible()
      .withTimeout(15000);
  });

  it('mostra o estado vazio para uma busca sem resultado', async () => {
    await tapSearchTab();

    const input = element(by.id('search-input'));
    await waitFor(input).toBeVisible().withTimeout(10000);
    await input.replaceText('asdkjhaskjdhaskjdhaskjd');

    // Mesmo motivo do teste acima: o container do estado vazio é flex:1 e o
    // teclado cobre parte dele, então relaxamos o limiar de visibilidade
    // (1% em vez dos 75% padrão) em vez de esconder o teclado.
    await waitFor(element(by.id('state-empty')))
      .toBeVisible(1)
      .withTimeout(15000);
  });
});
