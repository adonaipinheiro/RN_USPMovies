#!/usr/bin/env bash
#
# Back-merge da main para a develop, logo depois de um release.
#
# Por que isto existe: o release.yml bumpa MINOR na main e PATCH na develop, e
# nenhuma das duas volta pra outra. Sem este passo, package.json e
# android/app/build.gradle divergem e TODA promoção develop -> main chega
# conflitada (aconteceu em três PRs seguidos antes disto existir).
#
# Regra de segurança: a única resolução automática é a da VERSÃO. Se o merge
# conflitar em qualquer outro arquivo, isso é divergência real de código — o
# script aborta, abre um PR e falha, em vez de adivinhar.
#
# Roda com o cwd na raiz do repo, com a develop já em checkout.

set -euo pipefail

VERSION_FILES=("package.json" "android/app/build.gradle")

git fetch --quiet origin main

if git merge-base --is-ancestor origin/main HEAD; then
  echo "A develop já contém a main. Nada a fazer."
  exit 0
fi

read_version_name() { # <git-ref>
  git show "$1:package.json" | node -pe 'JSON.parse(require("fs").readFileSync(0,"utf8")).version'
}

read_version_code() { # <git-ref>
  git show "$1:android/app/build.gradle" |
    sed -n 's/^[[:space:]]*versionCode[[:space:]]\{1,\}\([0-9]\{1,\}\).*/\1/p' | head -1
}

if git merge origin/main --no-commit --no-ff; then
  echo "Merge limpo, sem conflito de versão."
else
  conflicts=$(git diff --name-only --diff-filter=U | sort)
  expected=$(printf '%s\n' "${VERSION_FILES[@]}" | sort)
  unexpected=$(comm -23 <(echo "$conflicts") <(echo "$expected"))

  if [ -n "$unexpected" ]; then
    git merge --abort
    echo "::error::Back-merge conflitou fora dos arquivos de versão:"
    echo "$unexpected"
    echo "Abrindo PR para resolução manual."
    gh pr create --base develop --head main \
      --title "chore: back-merge da main na develop (conflito manual)" \
      --body "O back-merge automático conflitou em arquivos que ele não sabe resolver sozinho:

\`\`\`
$unexpected
\`\`\`

Só a versão (\`package.json\` e \`android/app/build.gradle\`) é resolvida automaticamente — o resto é divergência real de código e precisa de gente. Resolva por aqui." || true
    exit 1
  fi

  # Conteúdo da develop (--ours) em tudo, versão da main por cima. Assim uma
  # dependência que só existe na develop não é perdida na resolução.
  main_version=$(read_version_name origin/main)
  main_code=$(read_version_code origin/main)
  dev_code=$(read_version_code HEAD)
  code=$(( main_code > dev_code ? main_code : dev_code ))

  for file in "${VERSION_FILES[@]}"; do
    if echo "$conflicts" | grep -qx "$file"; then
      git checkout --ours -- "$file"
    fi
  done

  npm pkg set "version=$main_version"
  # sed -i sem sufixo é GNU-only (quebra no BSD sed do macOS). Arquivo
  # temporário funciona nos dois, e este script precisa ser rodável à mão.
  sed -E -e "s|^([[:space:]]*versionName[[:space:]]).*|\1\"$main_version\"|" \
         -e "s|^([[:space:]]*versionCode[[:space:]]).*|\1$code|" \
    android/app/build.gradle > android/app/build.gradle.tmp
  mv android/app/build.gradle.tmp android/app/build.gradle

  git add -- "${VERSION_FILES[@]}"
  echo "Conflito de versão resolvido: versionName $main_version, versionCode $code."
fi

version=$(read_version_name origin/main)

# [skip ci] é obrigatório, não cosmético: sem ele o release.yml roda na develop,
# bumpa a versão de novo e recria na hora a divergência que este script existe
# para fechar.
git commit --no-edit -m "chore: back-merge da main (v$version) na develop [skip ci]" \
  -m "Sincronização automática pós-release — ver .github/scripts/back-merge.sh."

if ! git push origin HEAD:develop; then
  echo "::error::A develop avançou durante o back-merge e o push foi rejeitado."
  echo "Rode o workflow Release novamente na main, ou faça o merge à mão."
  exit 1
fi

echo "Back-merge concluído."
