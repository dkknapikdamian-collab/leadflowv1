const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}

function write(rel, content) {
  fs.writeFileSync(path.join(repo, rel), content, 'utf8');
}

function ensurePackageScript() {
  const pkgPath = path.join(repo, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:closeflow-payments-normalize-datetime-hotfix'] =
    'node scripts/check-closeflow-payments-normalize-datetime-hotfix.cjs';
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
}

function patchFinanceNormalize() {
  const rel = 'src/lib/finance/finance-normalize.ts';
  let source = read(rel);

  if (!source.includes('export function normalizeDateTime(')) {
    const addition = `

/**
 * API compatibility normalizer used by server functions such as api/payments.ts.
 * Returns an ISO string or null, so Vercel functions do not crash on a missing export.
 */
export function normalizeDateTime(value: unknown): string | null {
  const parsed = normalizeFinanceDate(value);
  return parsed ? parsed.toISOString() : null;
}
`;
    source = source.replace(/\s*$/, '') + addition + '\n';
  }

  write(rel, source);
}

function patchPaymentsImportIfNeeded() {
  const rel = 'api/payments.ts';
  let source = read(rel);
  const importPattern = /import\s*\{([\s\S]*?)\}\s*from\s*['"]\.\.\/src\/lib\/finance\/finance-normalize\.js['"];?/m;
  const match = source.match(importPattern);
  if (!match) {
    throw new Error('PAYMENTS_FINANCE_NORMALIZE_IMPORT_NOT_FOUND');
  }
  if (!match[1].includes('normalizeDateTime')) {
    const nextMembers = match[1].trimEnd() + '\n  normalizeDateTime,';
    source = source.replace(importPattern, `import {${nextMembers}\n} from '../src/lib/finance/finance-normalize.js';`);
    write(rel, source);
  }
}

function writeDoc() {
  const rel = 'docs/bugs/CLOSEFLOW_PAYMENTS_NORMALIZE_DATETIME_HOTFIX_2026-05-11.md';
  const doc = `# CLOSEFLOW_PAYMENTS_NORMALIZE_DATETIME_HOTFIX_2026-05-11

## Cel

Naprawić produkcyjny błąd 500 w endpointach zależnych od płatności i spraw.

## Realny objaw

Vercel / TypeScript zgłaszał:

\`\`\`text
api/payments.ts: Module "../src/lib/finance/finance-normalize.js" has no exported member "normalizeDateTime"
\`\`\`

Po tym padały między innymi:
- \`/api/payments\`
- \`/api/payments?leadId=...\`
- \`/api/payments?clientId=...\`
- widoki leada, klienta, spraw i kalendarza zależne od tych danych.

## Przyczyna

\`api/payments.ts\` importował \`normalizeDateTime\`, ale \`src/lib/finance/finance-normalize.ts\` eksportował tylko \`normalizeFinanceDate\`.

## Zmiana

Dodano eksport:

\`\`\`ts
export function normalizeDateTime(value: unknown): string | null
\`\`\`

Funkcja zwraca ISO string albo \`null\`, opierając się na istniejącym \`normalizeFinanceDate\`.

## Nie zmieniono

- struktury tabel,
- modelu płatności,
- relacji lead/client/case,
- UI,
- endpointów poza kompatybilnością eksportu.

## Check

Dodano:

\`\`\`json
"check:closeflow-payments-normalize-datetime-hotfix": "node scripts/check-closeflow-payments-normalize-datetime-hotfix.cjs"
\`\`\`

`;
  write(rel, doc);
}

patchFinanceNormalize();
patchPaymentsImportIfNeeded();
ensurePackageScript();
writeDoc();

console.log('CLOSEFLOW_PAYMENTS_NORMALIZE_DATETIME_HOTFIX_PATCH_OK');
