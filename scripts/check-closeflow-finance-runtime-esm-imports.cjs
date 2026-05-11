const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

const normalizePath = 'src/lib/finance/finance-normalize.ts';
const calculationsPath = 'src/lib/finance/finance-calculations.ts';
const docsPath = 'docs/bugs/CLOSEFLOW_FINANCE_RUNTIME_ESM_IMPORTS_HOTFIX_V2_2026-05-11.md';

if (!exists(normalizePath)) fail(`Brak ${normalizePath}`);
if (!exists(calculationsPath)) fail(`Brak ${calculationsPath}`);
if (!exists(docsPath)) fail(`Brak ${docsPath}`);

const normalize = read(normalizePath);
const calculations = read(calculationsPath);

if (!normalize.includes("from './finance-types.js'")) {
  fail('finance-normalize.ts nie importuje finance-types z rozszerzeniem .js');
}
if (!calculations.includes("from './finance-types.js'")) {
  fail('finance-calculations.ts nie importuje finance-types z rozszerzeniem .js');
}
if (!calculations.includes("from './finance-normalize.js'")) {
  fail('finance-calculations.ts nie importuje finance-normalize z rozszerzeniem .js');
}

const financeDir = path.join(root, 'src/lib/finance');
const files = fs.readdirSync(financeDir).filter((name) => name.endsWith('.ts'));
const bad = [];
const extensionlessFinanceImport = /from\s+['"]\.\/finance-[^'".]+['"]/g;

for (const file of files) {
  const rel = `src/lib/finance/${file}`;
  const content = read(rel);
  const matches = content.match(extensionlessFinanceImport);
  if (matches) {
    bad.push(`${rel}: ${matches.join(', ')}`);
  }
}

if (bad.length) {
  fail(`Zostały extensionless runtime imports w src/lib/finance:\n${bad.join('\n')}`);
}

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['check:closeflow-finance-runtime-esm-imports'] !== 'node scripts/check-closeflow-finance-runtime-esm-imports.cjs') {
  fail('package.json nie ma check:closeflow-finance-runtime-esm-imports');
}

console.log('CLOSEFLOW_FINANCE_RUNTIME_ESM_IMPORTS_CHECK_OK');
