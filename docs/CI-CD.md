# CI/CD

Pipeline no GitHub Actions, **Android apenas** por enquanto (iOS entra depois,
seguindo o mesmo desenho do repositório de referência `DomRing`).

> Cache: o `setup-node` guarda o `~/.cache/yarn` e o `setup-java` (`cache: gradle`)
> guarda `~/.gradle/caches` — a partir da 2ª execução o `yarn install` e o
> `bundleRelease` reaproveitam o download das dependências.

## Workflows

| Arquivo | Gatilho | O que faz |
| --- | --- | --- |
| `.github/workflows/ci.yml` | `pull_request` e push em `main` / `develop` | `yarn lint` + `yarn test --coverage --ci`. O `coverageThreshold` de 100% em `jest.config.js` reprova o build se a cobertura cair. |
| `.github/workflows/release.yml` | push em `main` / `develop` | Orquestra o release: sobe a versão e chama o build Android. |
| `.github/workflows/android-release.yml` | `workflow_call` (só via `release.yml`) | Compila o `.aab` assinado e publica como artefato do run. O passo de envio pro Google Play está **comentado** — reativar depois. |
| `.github/actions/install-deps/` | — | Composite action reutilizada por todos: `setup-node@22` + `yarn install --frozen-lockfile` com cache. |

## Fluxo do `release.yml`

1. **bump** — `npm version minor` em `main` / `patch` em `develop` (sem tag do npm),
   `react-native-version --target android` propaga `versionName` / `versionCode`
   para `android/app/build.gradle`, faz commit `chore(release): ...[skip ci]`,
   cria a tag `vX.Y.Z` e um GitHub Release (só em `main`).
2. **android** — reusa `android-release.yml`: `./gradlew bundleRelease`
   (`armeabi-v7a`, `arm64-v8a`) e sobe o AAB como artefato do run. O passo
   _Publish to Google Play_ está comentado por enquanto — só buildamos o AAB.

Coloque `[skip android]` na mensagem do commit para pular o build da plataforma.

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
