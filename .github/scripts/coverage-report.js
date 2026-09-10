// Monta o resumo de cobertura em Markdown a partir do coverage-summary.json
// que o Jest gera (reporter json-summary). O mesmo texto alimenta o Job Summary
// do run e o comentário no PR — um lugar só para formatar, dois consumidores.
//
// Não faz parte do app: roda só no CI, em Node puro, sem dependências.

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SUMMARY_PATH = path.join(REPO_ROOT, 'coverage', 'coverage-summary.json');

const summary = JSON.parse(fs.readFileSync(SUMMARY_PATH, 'utf8'));
const { total, ...files } = summary;

const METRICS = [
  ['Statements', 'statements'],
  ['Branches', 'branches'],
  ['Functions', 'functions'],
  ['Lines', 'lines'],
];

// O threshold do jest.config.js é 100% — qualquer coisa abaixo disso já reprovou
// o build, então o ícone aqui é só leitura rápida, não uma segunda régua.
const icon = pct => (pct >= 100 ? '🟢' : pct >= 80 ? '🟡' : '🔴');

const lines = [];
lines.push('## Cobertura de testes');
lines.push('');
lines.push('| Métrica | Cobertura | Coberto / Total |');
lines.push('| --- | --- | --- |');
for (const [label, key] of METRICS) {
  const m = total[key];
  lines.push(`| ${label} | ${icon(m.pct)} ${m.pct}% | ${m.covered} / ${m.total} |`);
}
lines.push('');

const below = Object.entries(files)
  .map(([file, m]) => ({ file: path.relative(REPO_ROOT, file), pct: m.statements.pct }))
  .filter(f => f.pct < 100)
  .sort((a, b) => a.pct - b.pct);

if (below.length === 0) {
  lines.push('Todos os arquivos instrumentados estão em 100%.');
} else {
  lines.push(`<details><summary>${below.length} arquivo(s) abaixo de 100%</summary>`);
  lines.push('');
  lines.push('| Arquivo | Statements |');
  lines.push('| --- | --- |');
  for (const f of below) {
    lines.push(`| \`${f.file}\` | ${icon(f.pct)} ${f.pct}% |`);
  }
  lines.push('');
  lines.push('</details>');
}

lines.push('');
lines.push(
  'Relatório navegável: [adonaipinheiro.github.io/RN_USPMovies](https://adonaipinheiro.github.io/RN_USPMovies/) ' +
    '(publicado a partir da `main`) · o HTML deste run está no artefato `coverage-report`.',
);

process.stdout.write(lines.join('\n') + '\n');
