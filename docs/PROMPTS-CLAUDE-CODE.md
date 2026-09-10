# Prompts para reconstruir este app com o Claude Code

### Arquitetura Mobile I‑II · MBA em Engenharia de Software — USP/Esalq

Este documento é o material prometido em aula: um roteiro de prompts que
reconstrói o **RN_USPMovies** do zero usando o [Claude Code](https://claude.com/claude-code).

Não é um prompt só. São **sete etapas**, na ordem em que o projeto foi
realmente construído. A razão é prática: um prompt gigante produz muito código
que você não leu e não consegue avaliar — que é exatamente o oposto do objetivo
da disciplina. Uma etapa por vez você consegue abrir o diff, entender a decisão
e discordar dela.

> O objetivo do exercício **não é ter o app pronto**. É conseguir defender cada
> fronteira entre camadas quando alguém perguntar "por que isso não podia ficar
> na tela?".

---

## Como usar

1. Crie uma pasta vazia e abra o Claude Code nela (`claude`).
2. Rode **uma etapa por vez**. Ao fim de cada uma: leia o diff, rode o app,
   e só então siga.
3. Use o **plan mode** (`shift+tab` duas vezes) nas etapas 1 e 3 — ele planeja
   antes de escrever, e você corrige o plano em vez de corrigir o código.
4. Você vai precisar de um **token v4 da API do TMDB**
   ([themoviedb.org](https://www.themoviedb.org/settings/api)). Nunca commite
   esse token.
5. Quando o Claude errar, **não aceite o primeiro conserto**. Peça a causa raiz.
   A seção [Armadilhas reais](#armadilhas-reais) mostra sete erros que
   aconteceram de verdade neste projeto e o que cada um ensina.

---

## Etapa 0 — Fixar as regras antes de escrever código

Esta etapa não gera nenhuma feature. Ela cria o `CLAUDE.md`, que o Claude Code
lê automaticamente em toda sessão — é o que impede a arquitetura de derreter na
terceira feature.

```
Vamos construir um app React Native didático: um catálogo de filmes consumindo a
API do TMDB. Antes de escrever qualquer código, quero fixar as regras do projeto.

Crie um CLAUDE.md na raiz com o seguinte, e nada além disso:

ARQUITETURA — seis camadas, como pastas de primeiro nível em src/, com a regra de
dependência sempre apontando para o domínio:

  presentation ──► domain ◄── repository ──► data ──► infra
                                ▲
                                │
                               di   (único lugar que conhece todas as camadas)

  - domain/     regras e contratos. NÃO importa React, axios, MMKV, nada. Só
                TypeScript puro: entities/, repositories/ (interfaces) e usecases/.
  - data/       fontes de dados. Já sabe "o que é um filme", mas não decide
                política: DTOs (o formato cru da TMDB) e mappers (DTO ↔ entidade).
  - infra/      encanamento técnico 100% genérico. NÃO sabe o que é um filme:
                cliente HTTP, storage key-value.
  - repository/ implementa as interfaces do domain, orquestrando data e infra.
                É aqui que mora política (cache-first, fallback offline).
  - presentation/ UI, estado de tela e navegação.
  - di/         composition root. O único arquivo que liga tudo.

REGRAS QUE NÃO SE NEGOCIAM:
  - A View é BURRA. Toda tela é `screens/X/index.tsx` (só JSX) mais
    `screens/X/hooks/useX.ts` (o ViewModel: estado, efeitos, chamadas ao domínio).
    Se tem `if` de regra de negócio dentro do JSX, está no lugar errado.
  - Nenhum arquivo de presentation importa axios, MMKV ou um DTO. Ele fala com o
    domínio através do container de DI.
  - Todo estado de tela é explícito: um tipo UiState<T> = loading | data | empty |
    error. Nada de três booleanos soltos (isLoading, hasError, isEmpty) — essa
    combinação permite estados impossíveis.
  - Navegação é desacoplada: as telas chamam um `coordinator` (goToDetail, goBack),
    nunca o objeto de navegação do React Navigation direto.
  - StyleSheet puro. Sem Tailwind, sem styled-components.
  - Todo arquivo começa com um comentário de uma linha dizendo a que camada
    pertence e por quê. É material didático — o comentário é parte da entrega.

Não escreva código ainda. Só o CLAUDE.md. Depois me explique, em até dez linhas,
qual é a diferença prática entre as camadas `data` e `infra` — quero conferir se
você entendeu antes de continuarmos.
```

> **Por que a última frase importa:** se a explicação vier vaga, sua especificação
> está vaga. Corrija agora, não depois de 40 arquivos.

---

## Etapa 1 — Scaffold e domínio

```
Agora o esqueleto.

1. Crie o projeto com a CLI oficial do React Native (TypeScript, new architecture
   ligada). Não use Expo.
2. Configure os aliases @domain, @data, @infra, @repository, @presentation,
   @store, @utils, @hooks, @di — no tsconfig.json E no babel.config.js
   (module-resolver). Os dois precisam concordar, senão o TypeScript aceita e o
   Metro quebra em runtime.
3. Configure react-native-dotenv para ler TMDB_ACCESS_TOKEN de um .env, com um
   .env.example versionado e o .env no .gitignore.

Depois escreva SOMENTE a camada domain — nada mais:

  domain/entities/movie.ts
    interface Movie { id, title, posterPath, overview, voteAverage, releaseYear, genres }
    e um helper puro moviePosterUrl(movie) que monta a URL da imagem.

  domain/repositories/
    MoviesRepository: getPopular(page), search(query, page), getDetails(id)
    FavoritesRepository: getAll(), toggle(movie), isFavorite(id)

  domain/usecases/
    getPopularMovies, searchMovies, getMovieDetails,
    toggleFavorite, getFavorites, observeIsFavorite

Os casos de uso são funções que RECEBEM o repositório e devolvem a função de uso
(injeção por parâmetro, sem framework de DI).

Atenção a uma decisão que quero explícita: FavoritesRepository.toggle recebe o
Movie inteiro, não só o id. É deliberado — precisamos guardar um snapshot local
para a tela de Favoritos funcionar offline, sem rede. Documente isso no código.

Ao terminar, rode o typecheck e me mostre a árvore de src/.
```

---

## Etapa 2 — Infra, data, repository e DI

```
Agora as camadas de fora para dentro, respeitando as fronteiras do CLAUDE.md.

infra/
  http/api.ts — instância axios com baseURL da TMDB e um interceptor que injeta
    o Bearer token. Adicione logs de request/response, mas SÓ dentro de if (__DEV__).
  storage/mmkv.ts — wrapper fino sobre react-native-mmkv com get/set de objeto.
    Genérico: não menciona "filme" em lugar nenhum.

data/
  remote/dto/movieDto.ts — o formato CRU da TMDB (snake_case: poster_path,
    vote_average, release_date...). Não mexa nesses nomes, eles são da API.
  mapper/movieMapper.ts — traduz DTO → Movie. É aqui que release_date
    "1999-03-30" vira releaseYear "1999".

repository/
  moviesRepository.ts — implementa MoviesRepository. Na primeira página de
    populares, grava o resultado no MMKV; se a chamada falhar, devolve o cache.
    Esse fallback é silencioso: a UI não tem um "modo offline", e o contrato do
    domínio não muda por causa dele.
  favoritesRepository.ts — implementa FavoritesRepository sobre o MMKV.

di/container.ts — instancia os seis casos de uso com os repositórios concretos.
  É o ÚNICO arquivo do projeto que importa de domain e repository ao mesmo tempo.

Antes de escrever, me diga onde você vai colocar a string '/movie/popular' e por
quê. Se a resposta for "infra", está errado: infra não sabe o que é um filme.
```

---

## Etapa 3 — Presentation

```
Agora a UI. Quatro telas, cada uma com View burra + hook ViewModel.

  screens/Popular/    lista com paginação infinita
  screens/Search/     busca com debounce de 400ms
  screens/Detail/     detalhe do filme
  screens/Favorites/  lista local + um seletor de tema (light/dark/sistema)

Estado:
  - TanStack React Query v5 para server state (populares, busca, detalhe).
    useInfiniteQuery na paginação.
  - Zustand v5 para client state (favoritos e tema), persistido em MMKV.
    Exporte SELETORES (useIsFavorite(id)), não a store inteira — assim um card
    não re-renderiza quando outro filme é favoritado.

Componentes reutilizáveis:
  - MovieCard, FavButton
  - StateView<T> — recebe o UiState<T> e renderiza loading/empty/error,
    delegando o caso 'data' para uma children function. Toda tela de dados passa
    por ele. É o que garante que os quatro estados existam em todo lugar.
  - Button com implementação por plataforma: Button.ios.tsx e Button.android.tsx,
    mesma interface em types.ts. Mostre o Metro resolvendo a extensão sozinho.

Navegação: React Navigation v7, bottom tabs (Populares/Buscar/Favoritos) + native
stack para o Detail. Crie navigation/coordinator.ts com goToDetail(id) e goBack().
Nenhuma tela importa useNavigation direto.

Tema light/dark via store + um hook useAppTheme que devolve as cores.

Quando terminar, rode o app e me mostre as quatro telas funcionando com dados
reais. Depois me aponte qual arquivo de presentation ficou mais perto de violar a
regra de dependência — quero saber onde o desenho está sob tensão.
```

---

## Etapa 4 — Testes unitários

```
Agora a suíte unitária, com Jest e @testing-library/react-native.

Estrutura: src/__tests__/ espelhando src/ 1:1. Mocks centralizados em
src/__tests__/__mocks__/ (fixtures de Movie, mock do container, do MMKV, do
React Query), acessíveis por um alias @mocks.

Teste todas as camadas:
  - domain: os casos de uso, com repositórios fake
  - data: o mapper, incluindo os campos nulos da TMDB
  - repository: a política de cache — inclusive o caminho de falha de rede
  - presentation: os hooks (renderHook) e os componentes

Trave o coverageThreshold em 100% (branches, functions, lines, statements) no
jest.config.js.

Uma regra sobre a cobertura, e ela é a parte mais importante desta etapa:
se um branch não for alcançável por um teste honesto, NÃO invente um teste para
cobri-lo — me traga o branch e vamos discutir se ele deveria existir. Código
inalcançável é código morto, e cobertura de 100% obtida com teste artificial é
pior do que 90% honesto.

Rode a suíte três vezes seguidas. Se algum teste variar entre as execuções, é
flakiness real (provavelmente uma corrida no React Query) — investigue a corrida,
não aumente o timeout.
```

> Neste projeto essa regra derrubou dois trechos: um estado `empty` morto em
> `useDetail` (o React Query v5 nunca resolve `data` como `undefined` em sucesso)
> e um `onRetry` obrigatório em telas que nunca entram em erro. Os dois viraram
> código deletado, não teste novo.

---

## Etapa 5 — Acessibilidade

```
Passe de acessibilidade em toda a UI, para VoiceOver (iOS) e TalkBack (Android).

Todo elemento interativo precisa de accessibilityRole, accessibilityLabel e,
quando tiver estado, accessibilityState.

Dois casos merecem atenção especial — não resolva no automático:

1. MovieCard é um touchable com OUTRO touchable dentro (o botão de favoritar).
   Isso é um problema real de acessibilidade em React Native: um Pressable
   aninhado dentro de um container `accessible` fica inalcançável pela navegação
   linear do leitor de tela. Resolva agrupando o card num único elemento de
   acessibilidade (um card = um anúncio, não pôster + título + nota soltos) e
   expondo o favoritar como accessibilityAction. Explique a solução em comentário.

2. Os estados vazio e de erro aparecem sem o usuário tocar em nada. Use
   accessibilityLiveRegion="polite" para que sejam anunciados sozinhos.

Adicione também testID em tudo que um teste E2E vai precisar selecionar
(listas, cards, campo de busca, botões, abas). A ideia é que o mesmo trabalho
sirva para as duas coisas: o que torna a UI navegável por leitor de tela é o que
a torna endereçável por teste.
```

---

## Etapa 6 — Testes E2E com Detox

```
Agora testes end-to-end com Detox 20, rodando o app real (build nativo) num
emulador Android e num simulador iOS. Sem mock: o app vai bater na API de verdade.

Specs em src/__tests__/e2e/, cobrindo:
  - populares + abrir o detalhe + voltar
  - busca: resultado encontrado e estado vazio
  - favoritar na lista e ver o filme na aba Favoritos

Configuração necessária (confira cada item, vários falham em silêncio):
  - .detoxrc.js com os devices REAIS da minha máquina. Descubra os nomes com
    `emulator -list-avds` e `xcrun simctl list devices available` — não chute.
  - No Android, o AAR com.wix:detox NÃO está em nenhum repositório remoto: vem
    dentro do pacote npm. Registre node_modules/detox/Detox-android como
    repositório Maven local no build.gradle raiz.
  - androidTest com a classe ponte do Detox e o testInstrumentationRunner.
  - No iOS não é preciso criar Test Target nenhum: o Detox 20 traz e gerencia o
    próprio runner XCUITest. O pré-requisito real é o applesimutils (brew).
  - O jest do E2E precisa de config próprio e tsconfig próprio: os globais do
    Detox (device, element, by, expect) colidem com os do Jest usados na suíte
    unitária.
  - ATENÇÃO: se os specs moram dentro de src/__tests__/, o testMatch padrão do
    Jest (**/__tests__/**) vai varrer os specs E2E na suíte unitária. É preciso
    ignorá-los explicitamente no jest.config.js da raiz.

Prove que funciona rodando as duas suítes até passarem. Se um teste falhar, olhe
o SCREENSHOT do artefato antes de mudar o código — na maioria das vezes o app
está certo e a asserção é que está errada.
```

---

## Etapa 7 — CI/CD

```
Por último, a esteira no GitHub Actions (Android por enquanto):

  - Uma composite action reutilizável para setup de Node + yarn com cache.
  - ci.yml: lint + testes com cobertura, em pull request e push. O threshold de
    100% reprova o build.
  - release.yml: a cada push em main/develop, sobe a versão (minor em main, patch
    em develop), cria tag e GitHub Release, e chama o build Android.
  - android-release.yml: bundleRelease assinado, publicando o .aab como artefato.
    Deixe o passo de envio para o Google Play escrito porém COMENTADO.

O signing lê um keystore.properties fora do versionamento, com fallback para a
debug key quando o arquivo não existe — assim o build funciona para quem clonar
o repo sem ter a keystore.

A suíte E2E NÃO entra no CI: exige emulador e um token TMDB válido. Documente
essa decisão em vez de escondê-la.

Escreva um docs/CI-CD.md explicando o fluxo e quais secrets precisam existir.
```

---

## Armadilhas reais

Oito erros que aconteceram **de verdade** durante a construção deste projeto.
Valem mais que o código pronto: são o tipo de coisa que nenhum tutorial mostra.

| # | Sintoma | Causa raiz | O que ensina |
|---|---|---|---|
| 1 | `com.wix:detox` nunca resolve no Gradle | O AAR não é publicado em repositório remoto — vem dentro do pacote npm | Nem toda dependência mora onde você presume. Leia o `node_modules` antes de brigar com o Gradle. |
| 2 | `Detox.runTests(this, config)` não compila | A API recebe um `ActivityTestRule`, não a classe de teste | Código gerado por LLM envelhece com a API. Confira a assinatura real (`javap` no AAR resolve). |
| 3 | Aba não é encontrada pelo testID no Android | O React Navigation v7 renomeou `tabBarTestID` → `tabBarButtonTestID` e **ignora a prop antiga em silêncio** | Prop desconhecida em objeto de options não dá erro. Falha silenciosa é a pior categoria de bug. |
| 4 | `typeText` não digita nada no emulador | O IME do emulador sobe com barra de voz/colar e engole as teclas | Use `replaceText` quando o objetivo não é testar o teclado. |
| 5 | `toBeVisible()` falha numa tela visivelmente correta | O Detox exige **75%** do elemento na tela, e o teclado cobria metade da lista | Leia a régua da ferramenta antes de concluir que o app está errado. O screenshot do artefato provou que a UI estava certa. |
| 6 | `by.text('Buscar')` ora acha, ora não | É ao mesmo tempo o label da aba e o título da tela — e o tap corria com o reload | Seletor por texto é ambíguo e frágil. `testID` é contrato. |
| 7 | Jest morre na largada com erro do watchman | Diretório de estado do watchman sem permissão | `watchman: false` no config. Nem todo erro vermelho é do seu código. |
| 8 | Um PR não roda CI nenhum — sem erro, sem check, sem nada | A mensagem do commit **explicava** o marcador `[skip ci]` em prosa, e o GitHub leu o token literal | Documentar um marcador o aciona. Ferramenta que lê texto livre em busca de diretiva não distingue uso de menção. |

E uma que é de arquitetura, não de ferramenta:

> Na primeira versão este projeto tinha **três** camadas (domain/data/presentation).
> Ele virou seis porque `data` estava acumulando duas responsabilidades diferentes:
> o encanamento técnico genérico (cliente HTTP, storage — que não sabe o que é um
> filme) e as fontes de dados do produto (DTO, mapper — que sabem). Separar
> `infra` de `data`, e `repository` de ambas, tornou a regra de dependência
> verificável de fora: dá para abrir qualquer arquivo e dizer se o import é legal.
> **Camada demais é ruim; camada de menos é pior — e você só descobre qual é o caso
> quando tenta explicar a fronteira em voz alta.**

---

## Prompt curinga: auditar a arquitetura

Use este a qualquer momento, e principalmente antes de entregar:

```
Audite este projeto contra a regra de dependência declarada no CLAUDE.md.

Liste TODA violação, com arquivo e linha:
- algum arquivo de domain/ importando React, axios, MMKV ou qualquer framework?
- algum arquivo de presentation/ importando um DTO, o axios ou o MMKV direto?
- algum arquivo de infra/ que mencione "movie"/"filme" (ou seja: que saiba o que
  é o produto)?
- alguma tela com regra de negócio no JSX em vez do hook?
- algum lugar usando booleanos soltos onde deveria usar UiState?

Para cada violação, diga o custo concreto de mantê-la — não só "fere a Clean
Architecture". Se não encontrar nenhuma, diga isso claramente em vez de inventar
um achado fraco para parecer útil.
```

---

## Para entregar

O que se espera que você consiga fazer ao fim do exercício:

1. Abrir qualquer arquivo e dizer a que camada pertence e por quê.
2. Justificar cada fronteira — em especial `data` × `infra` × `repository`.
3. Apontar pelo menos uma decisão do Claude Code com a qual você **discordou**,
   e explicar o que mudou e por quê. Esta é a parte que mais conta: usar a
   ferramenta é fácil, revisar o que ela produziu é o trabalho.
