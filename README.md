# RN_USPMovies 🎬

[![CI](https://github.com/adonaipinheiro/RN_USPMovies/actions/workflows/ci.yml/badge.svg)](https://github.com/adonaipinheiro/RN_USPMovies/actions/workflows/ci.yml)
[![Release](https://github.com/adonaipinheiro/RN_USPMovies/actions/workflows/release.yml/badge.svg)](https://github.com/adonaipinheiro/RN_USPMovies/actions/workflows/release.yml)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
![Tests](https://img.shields.io/badge/tests-109_passing-brightgreen)
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

Quatro camadas como pastas de 1º nível em `src/`, com a regra de dependência
apontando para o domínio:

```
presentation ──► domain ◄── repositories ──► infra
```

| Camada | Papel | Conteúdo |
|---|---|---|
| `domain/` | regras e contratos, sem dependência de framework | `entities/movie.ts`, `repositories/*` (interfaces), `usecases/*` (`getPopularMovies`, `searchMovies`, `getMovieDetails`, `toggleFavorite`, `getFavorites`, `observeIsFavorite`) |
| `repositories/` | implementam os contratos do domínio; conhecem "o que é um filme" | `moviesRepository.ts`, `favoritesRepository.ts`, `movieMapper.ts`, `dto/` |
| `infra/` | encanamento técnico genérico, não sabe o que é um filme | `http/api.ts` (axios + interceptors), `storage/mmkv.ts` |
| `presentation/` | UI e estado de tela | `screens/{Popular,Search,Detail,Favorites}` (View + `hooks/useX.ts` como ViewModel), `components/` (`MovieCard`, `FavButton`, `StateView`, `Button`) |

Transversais: `di/container.ts` (composition root), `store/` (Zustand — favoritos e
tema, persistidos via MMKV), `routes/` (React Navigation v7 + `navigation/coordinator.ts`),
`hooks/`, `utils/`.

## Stack

- **React Native 0.87** (New Architecture) · **React 19** · **TypeScript**
- **TanStack React Query v5** — server state (populares, busca, detalhe)
- **Zustand v5** — client state (favoritos, tema) com persistência **MMKV**
- **axios** — camada `infra/http`
- **React Navigation v7** — bottom tabs + native stack
- **Jest** + **@testing-library/react-native** — testes
- `StyleSheet` puro (sem Tailwind), tema light/dark, aliases `@domain`, `@infra`, `@repositories`, `@presentation`, `@store`, `@routes`, `@utils`, `@hooks`, `@di`

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

```sh
yarn test              # roda a suíte
yarn test --coverage   # com cobertura
```

**35 suítes · 109 testes · 100% de cobertura.** O `jest.config.js` trava o
`coverageThreshold` em 100% (branches/functions/lines/statements) — a suíte
reprova se a cobertura cair. Os testes espelham `src/` 1:1 em `src/__tests__/`,
com mocks centralizados em `src/__tests__/__mocks__/` (alias `@mocks`).

## CI/CD

GitHub Actions, **Android por enquanto**:

- **`ci.yml`** — `yarn lint` + `yarn test --coverage` em cada PR e push (`main`/`develop`).
- **`release.yml`** — a cada push em `main`/`develop`: bump de versão
  (`minor` em `main`, `patch` em `develop`), tag `vX.Y.Z`, GitHub Release, e
  dispara o build Android.
- **`android-release.yml`** — `./gradlew bundleRelease` assinado, publica o
  `.aab` como artefato do run. Envio pro Google Play está pronto, porém comentado.

Detalhes, keystore e secrets em [`docs/CI-CD.md`](docs/CI-CD.md).

## Estrutura de pastas

```
src/
├── domain/          entities · repositories (interfaces) · usecases
├── repositories/    implementações + mapper + dto
├── infra/           http (axios) · storage (mmkv)
├── presentation/    screens (View + hook/ViewModel) · components · state
├── routes/          navigation (coordinator) · stack · theme
├── store/           zustand (favoritos, tema)
├── di/              container (composition root)
├── hooks/ · utils/
└── __tests__/       espelha src/ 1:1 · __mocks__/
```
