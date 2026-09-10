# RN_USPMovies 🎬

[![CI](https://github.com/adonaipinheiro/RN_USPMovies/actions/workflows/ci.yml/badge.svg)](https://github.com/adonaipinheiro/RN_USPMovies/actions/workflows/ci.yml)
[![Release](https://github.com/adonaipinheiro/RN_USPMovies/actions/workflows/release.yml/badge.svg)](https://github.com/adonaipinheiro/RN_USPMovies/actions/workflows/release.yml)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
![Tests](https://img.shields.io/badge/tests-111_passing-brightgreen)
![E2E](https://img.shields.io/badge/E2E-Detox-9c27b0)
![React Native](https://img.shields.io/badge/React_Native-0.87-blue)
![React](https://img.shields.io/badge/React-19-149eca)
![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178c6)
![New Architecture](https://img.shields.io/badge/New_Architecture-on-8a2be2)
![Platform](https://img.shields.io/badge/platform-Android-3ddc84)

Catálogo de filmes consumindo a API do **TMDB**, escrito em React Native. É o app
de referência da stack RN do curso **Arquitetura Mobile I‑II** (MBA em Engenharia
de Software — USP/Esalq). O mesmo escopo funcional e a mesma arquitetura são
implementados em paralelo em três stacks (Kotlin/Android, Swift/iOS e este RN)
para mostrar que **arquitetura é um plano independente da tecnologia**.

> Projeto didático. O foco é a organização em camadas, os testes e a esteira de
> CI/CD — não uma publicação real na loja.

## Funcionalidades

| # | Feature | Detalhe |
|---|---|---|
| F1 | Lista de populares | paginação infinita |
| F2 | Busca | com debounce |
| F3 | Detalhe do filme | — |
| F4 | Favoritar / desfavoritar | persistido local (MMKV), funciona offline |
| F5 | Tela de favoritos | lê o snapshot local |
| F6 | Cache offline dos populares | aplicado dentro do repositório |

Toda tela de dados trata os estados **loading / data / empty / error**.

## Arquitetura

Seis camadas explícitas como pastas de 1º nível em `src/`, com a regra de
dependência apontando para o domínio:

```
presentation ──► domain ◄── repository ──► data ──► infra
                              ▲
                              │
                             di   (único lugar que conhece todas as camadas)
```

| Camada | Papel | Conteúdo |
|---|---|---|
| `domain/` | regras e contratos, sem dependência de framework | `entities/movie.ts`, `repositories/*` (interfaces `MoviesRepository`/`FavoritesRepository`), `usecases/*` (`getPopularMovies`, `searchMovies`, `getMovieDetails`, `toggleFavorite`, `getFavorites`, `observeIsFavorite`) |
| `data/` | fontes de dados — já conhece "o que é um filme", mas não decide política | `remote/dto/movieDto.ts` (formato bruto da TMDB), `mapper/movieMapper.ts` (tradução DTO ↔ entidade de domínio) |
| `infra/` | encanamento técnico 100% genérico, não sabe o que é um filme | `http/api.ts` (instância axios + interceptors), `storage/mmkv.ts` |
| `repository/` | implementa os contratos do domínio, orquestrando uma ou mais fontes de `data` (ex.: fallback offline da F6) | `moviesRepository.ts`, `favoritesRepository.ts` |
| `presentation/` | UI, estado de tela e navegação | `screens/{Popular,Search,Detail,Favorites}` (View + `hooks/useX.ts` como ViewModel), `components/` (`MovieCard`, `FavButton`, `StateView`, `Button`), `navigation/` (React Navigation v7 + `navigation/coordinator.ts`, `stack/`, `theme/`) |

Transversal: `di/container.ts` — composition root, único ponto que liga
`domain` → `repository` → `data` → `infra`. `store/` (Zustand — favoritos e
tema, persistidos via MMKV), `hooks/` e `utils/` seguem soltos, consumidos
pela presentation.

## Stack

- **React Native 0.87** (New Architecture) · **React 19** · **TypeScript**
- **TanStack React Query v5** — server state (populares, busca, detalhe)
- **Zustand v5** — client state (favoritos, tema) com persistência **MMKV**
- **axios** — camada `infra/http`
- **React Navigation v7** — bottom tabs + native stack
- **Jest** + **@testing-library/react-native** — testes unitários e de componente
- **Detox 20** — testes end-to-end no app real (emulador/simulador)
- `StyleSheet` puro (sem Tailwind), tema light/dark, aliases `@domain`, `@data`, `@infra`, `@repository`, `@presentation`, `@store`, `@utils`, `@hooks`, `@di`

## Rodando o projeto

Pré‑requisitos: ambiente RN configurado ([guia oficial](https://reactnative.dev/docs/set-up-your-environment)),
**Node ≥ 22.11** e um token da API do TMDB.

```sh
# 1. dependências
yarn install

# 2. variáveis de ambiente
cp .env.example .env
# edite .env e coloque seu TMDB_ACCESS_TOKEN (token v4 do TMDB)

# 3. Metro
yarn start

# 4. em outro terminal — Android
yarn android
```

iOS também roda localmente (`bundle install && bundle exec pod install` em `ios/`,
depois `yarn ios`), mas ainda **não tem CI**.

## Testes

### Unitários e de componente (Jest)

```sh
yarn test              # roda a suíte
yarn test --coverage   # com cobertura
```

**35 suítes · 111 testes · 100% de cobertura.** O `jest.config.js` trava o
`coverageThreshold` em 100% (branches/functions/lines/statements) — a suíte
reprova se a cobertura cair. Os testes espelham `src/` 1:1 em `src/__tests__/`,
com mocks centralizados em `src/__tests__/__mocks__/` (alias `@mocks`).

### End-to-end (Detox)

Os specs em `src/__tests__/e2e/` rodam o app **de verdade** (build nativo) num emulador ou
simulador, sem mock nenhum: cobrem F1+F3 (`popular.e2e.ts`), F2 com o debounce
e o estado vazio (`search.e2e.ts`) e F4+F5 (`favorites.e2e.ts`).

```sh
# Android — com o Metro rodando (yarn start) em outro terminal
yarn e2e:build:android
yarn e2e:test:android

# iOS
yarn e2e:build:ios
yarn e2e:test:ios
```

Pré-requisito só do iOS: o Detox usa o
[`applesimutils`](https://github.com/wix/AppleSimulatorUtils) pra falar com o
simulador — `brew tap wix/brew && brew install applesimutils` (o Homebrew pode
pedir um `brew trust wix/brew` antes). No Android não há equivalente: o
`adb`/`emulator` do SDK bastam.

Detalhes que valem saber antes de rodar:

- O device é escolhido no `.detoxrc.js`. Hoje aponta pro AVD **`Pixel_10`**
  (Android) e pro simulador **`iPhone 17`**. Em outra máquina, ajuste com
  `emulator -list-avds` e `xcrun simctl list devices available`.
- Como o app é o real, o `.env` com `TMDB_ACCESS_TOKEN` **precisa estar
  configurado** — sem token válido a tela de Populares cai em erro e os specs
  que dependem dela falham.
- Em debug o bundle vem do Metro, então **o Metro precisa estar no ar**; o
  Detox faz o `adb reverse` da porta 8081 sozinho (`reversePorts` no
  `.detoxrc.js`).
- Nenhum target extra no Xcode é necessário: o Detox 20 traz e gerencia o
  próprio runner XCUITest, e no Android a ponte é o `DetoxTest.kt` em
  `android/app/src/androidTest/`. O AAR nativo (`com.wix:detox`) não está em
  repositório remoto — vem dentro do pacote npm, e o `android/build.gradle`
  registra `node_modules/detox/Detox-android` como repositório Maven local.
- Artefatos de falha (log + screenshot) caem em `artifacts/` (gitignored).

Os specs selecionam elementos exclusivamente por `testID` (`by.id(...)`) — os
mesmos `testID`/`accessibilityLabel` adicionados para acessibilidade servem de
referência estável pros testes, em vez de duplicar seletores. As abas usam
`tabBarTestID` (`tab-popular`/`tab-search`/`tab-favorites`) em vez do texto
visível: o label "Buscar" também é o título da tela de busca, o que torna o
matcher por texto ambíguo.

## Acessibilidade

Todo elemento interativo (botões, card de filme, campo de busca, abas, toggle de
tema) tem `accessibilityRole`/`accessibilityLabel`/`accessibilityState`
adequados para VoiceOver (iOS) e TalkBack (Android). Dois pontos que valem a
leitura do código como referência:

- **`MovieCard`** agrupa pôster/título/nota num único elemento de acessibilidade
  (um card = um anúncio de leitor de tela, não fragmentos soltos) e expõe o
  favoritar aninhado como `accessibilityAction` — a forma correta de lidar com
  um botão dentro de outro elemento tocável em React Native, já que um
  `Pressable` aninhado dentro de um container `accessible` fica inalcançável
  pela navegação linear do leitor de tela.
- **`StateView`** usa `accessibilityLiveRegion="polite"` nos estados vazio/erro,
  pra anunciar a mudança sozinho, sem o usuário precisar "descobrir" a tela.

## CI/CD

GitHub Actions, **Android por enquanto**:

- **`ci.yml`** — `yarn lint` + `yarn test --coverage` em cada PR e push (`main`/`develop`).
- **`release.yml`** — a cada push em `main`/`develop`: bump de versão
  (`minor` em `main`, `patch` em `develop`), tag `vX.Y.Z`, GitHub Release, e
  dispara o build Android.
- **`android-release.yml`** — `./gradlew bundleRelease` assinado, publica o
  `.aab` como artefato do run. Envio pro Google Play está pronto, porém comentado.

A suíte E2E **não roda no CI** — exige emulador/simulador e um token TMDB
válido; por enquanto é execução local.

Detalhes, keystore e secrets em [`docs/CI-CD.md`](docs/CI-CD.md).

## Estrutura de pastas

```
src/
├── domain/          entities · repositories (interfaces) · usecases
├── data/            remote (dto) · mapper
├── infra/           http (axios) · storage (mmkv)
├── repository/      implementações dos contratos do domínio
├── presentation/    screens (View + hook/ViewModel) · components · navigation (coordinator · stack · theme)
├── store/           zustand (favoritos, tema)
├── di/              container (composition root)
├── hooks/ · utils/
└── __tests__/       espelha src/ 1:1 · __mocks__/ · e2e/ (specs do Detox)

.detoxrc.js          devices, apps e comandos de build do Detox
```
