# CI/CD

Pipeline no GitHub Actions, **Android apenas** por enquanto (iOS entra depois,
seguindo o mesmo desenho).

> Cache: o `setup-node` guarda o `~/.cache/yarn` e o `setup-java` (`cache: gradle`)
> guarda `~/.gradle/caches` — a partir da 2ª execução o `yarn install` e o
> `bundleRelease` reaproveitam o download das dependências.

## Workflows

| Arquivo | Gatilho | O que faz |
| --- | --- | --- |
| `.github/workflows/ci.yml` | `pull_request` e push em `main` / `develop` | `yarn lint` + `yarn test --coverage --ci`, e publica a cobertura (ver abaixo). O `coverageThreshold` de 100% em `jest.config.js` reprova o build se a cobertura cair. |
| `.github/workflows/release.yml` | push em `main` / `develop` | Orquestra o release: sobe a versão e chama o build Android. |
| `.github/workflows/android-release.yml` | `workflow_call` (só via `release.yml`) | Compila o `.aab` assinado e publica como artefato do run. O passo de envio pro Google Play está **comentado** — reativar depois. |
| `.github/actions/install-deps/` | — | Composite action reutilizada por todos: `setup-node@22` + `yarn install --frozen-lockfile` com cache. |
| `.github/scripts/coverage-report.js` | — | Node puro, sem dependências: transforma o `coverage-summary.json` do Jest na tabela em Markdown usada pelo Job Summary e pelo comentário no PR. |
| `.github/scripts/back-merge.sh` | — | Sincroniza a `develop` com a `main` depois de cada release (ver abaixo). |

## Fluxo do `release.yml`

1. **bump** — `npm version minor` em `main` / `patch` em `develop` (sem tag do npm),
   `react-native-version --target android` propaga `versionName` / `versionCode`
   para `android/app/build.gradle`, faz commit `chore(release): ...[skip ci]`,
   cria a tag `vX.Y.Z` e um GitHub Release (só em `main`).
2. **android** — reusa `android-release.yml`: `./gradlew bundleRelease`
   (`armeabi-v7a`, `arm64-v8a`) e sobe o AAB como artefato do run. O passo
   _Publish to Google Play_ está comentado por enquanto — só buildamos o AAB.

Coloque `[skip android]` na mensagem do commit para pular o build da plataforma.

## Back-merge automático (`main` → `develop`)

O `release.yml` bumpa **minor na `main`** e **patch na `develop`**. Sem nada
devolvendo uma para a outra, as duas divergem em `package.json` e
`android/app/build.gradle`, e **toda** promoção `develop` → `main` chega
conflitada — aconteceu em três PRs seguidos antes deste job existir.

Depois de um release na `main`, o job `back-merge` mergeia a `main` de volta na
`develop`. A lógica está em `.github/scripts/back-merge.sh`:

| Situação | O que faz |
| --- | --- |
| `develop` já contém a `main` | Não faz nada e sai com sucesso. |
| Merge limpo | Commita e empurra. |
| Conflito **só** em `package.json` / `build.gradle` | Resolve sozinho: mantém o conteúdo da `develop` (`--ours`) e aplica por cima o `versionName` da `main` e o maior `versionCode`. |
| Conflito em **qualquer outro** arquivo | Aborta o merge, abre um PR `main` → `develop` e falha o job. |

Duas decisões que valem explicação:

- **Por que `--ours` e não `--theirs`.** Tomar o lado da `main` inteiro
  descartaria em silêncio o que só existe na `develop` (uma dependência nova no
  `package.json`, por exemplo). O script fica com o arquivo da `develop` e
  sobrescreve **apenas as linhas de versão**.
- **Por que o commit leva `[skip ci]`.** Sem ele o `release.yml` roda na
  `develop`, bumpa a versão outra vez e recria na hora a divergência que o job
  existe para fechar. O conteúdo empurrado é idêntico ao que a `main` acabou de
  testar, então não há o que revalidar.

O script é rodável à mão, da raiz do repo, com a `develop` em checkout.

## Publicação da cobertura

O `jest.config.js` usa três reporters: `lcov` (gera o `lcov.info` e o relatório
HTML em `coverage/lcov-report`), `text` (a tabela no terminal, uso local) e
`json-summary` (o `coverage-summary.json`, de onde saem os números do CI).

Com isso o `ci.yml` faz três coisas, em todo run:

1. **Job Summary** — tabela de cobertura na própria página do run. Roda com
   `if: always()`: um run que caiu abaixo do threshold é justamente quando
   interessa ver quais arquivos caíram.
2. **Comentário no PR** — o mesmo texto, postado via `actions/github-script`
   (sem action de terceiro). O comentário carrega um marcador HTML invisível e é
   **atualizado** a cada push, em vez de virar uma pilha de comentários.
   Exige `pull-requests: write` no job.
3. **Artefato `coverage-report`** — o HTML navegável, guardado por 14 dias em
   qualquer run, inclusive de PR.

E, só em push na `main`, o job `publish-coverage` manda o HTML para o **GitHub
Pages**: <https://adonaipinheiro.github.io/RN_USPMovies/>. Publicar também da
`develop` faria uma branch sobrescrever a outra — o badge do README aponta para
o estado publicado, então a fonte é a `main`.

O Pages está configurado com `build_type: workflow` (deploy pelo Actions, sem
branch `gh-pages`), o que exige as permissões `pages: write` e `id-token: write`
no job de deploy.

## Assinatura (signing)

`android/app/build.gradle` lê `android/app/keystore.properties` se ele existir;
senão, o release é assinado com a **debug key** (build continua verde).

- **Local:** `cp android/app/keystore.properties.example android/app/keystore.properties`
  e preencha com a sua keystore (o arquivo está no `.gitignore`).
- **CI:** o passo _Decode release keystore_ gera esse arquivo a partir dos secrets.

## Secrets necessários (Settings → Secrets and variables → Actions)

| Secret | Para quê |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | keystore de upload em base64. Sem ele, o release é assinado com a debug key. |
| `ANDROID_KEYSTORE_PASSWORD` | senha da store e da key (iguais). `keyAlias` fixo: `uspmovies-upload`. |

A keystore de upload já foi gerada em `android/app/upload.keystore` (fora do git,
guardar backup em local seguro). Para recriar:

```sh
keytool -genkeypair -v -storetype PKCS12 \
  -keystore android/app/upload.keystore -alias uspmovies-upload \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -storepass 'SENHA' -keypass 'SENHA' \
  -dname 'CN=RN USPMovies, OU=USP Esalq, O=Adonai Junio Pinheiro, L=Piracicaba, ST=SP, C=BR'
base64 -i android/app/upload.keystore   # valor do ANDROID_KEYSTORE_BASE64
```

`PLAY_STORE_SERVICE_ACCOUNT_JSON` só é necessário quando reativar a publicação no
Play Store (passo comentado em `android-release.yml`).

## O que falta

- Criar os dois secrets acima (sem eles o build ainda passa, assinando com a
  debug key).
- Permitir que o GitHub Actions faça push na branch protegida (o job `bump`
  commita a subida de versão) — ou remover o passo de commit/tag se preferir
  bump manual.
- Para publicar na loja: criar `PLAY_STORE_SERVICE_ACCOUNT_JSON`, fazer o 1º
  upload manual do `.aab` no Play Console e descomentar o passo _Publish to
  Google Play_.
