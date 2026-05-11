const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}

function write(rel, content) {
  fs.writeFileSync(path.join(repo, rel), content.replace(/\r?\n/g, '\n'));
}

function exists(rel) {
  return fs.existsSync(path.join(repo, rel));
}

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function patchFinanceImports(rel) {
  if (!exists(rel)) return false;
  const before = read(rel);
  let after = before;

  // Vercel serverless Node runs emitted JS as ESM. Relative runtime imports need .js.
  after = after.replace(/from\s+(['"])\.\/(finance-[^'".]+)\1/g, "from './$2.js'");

  // Defensive cleanup if a previous patch accidentally duplicated .js.
  after = after.replace(/from\s+(['"])\.\/(finance-[^'"]+)\.js\.js\1/g, "from './$2.js'");

  if (after !== before) {
    write(rel, after);
    return true;
  }
  return false;
}

function patchPackageJson() {
  const rel = 'package.json';
  const pkg = JSON.parse(read(rel));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:closeflow-finance-runtime-esm-imports'] = 'node scripts/check-closeflow-finance-runtime-esm-imports.cjs';
  fs.writeFileSync(path.join(repo, rel), JSON.stringify(pkg, null, 2) + '\n');
}

function main() {
  ensure(exists('src/lib/finance/finance-normalize.ts'), 'Brak src/lib/finance/finance-normalize.ts');
  ensure(exists('src/lib/finance/finance-calculations.ts'), 'Brak src/lib/finance/finance-calculations.ts');

  const financeDir = path.join(repo, 'src/lib/finance');
  const files = fs.readdirSync(financeDir)
    .filter((name) => name.endsWith('.ts'))
    .map((name) => `src/lib/finance/${name}`);

  for (const rel of files) patchFinanceImports(rel);

  patchPackageJson();

  console.log('CLOSEFLOW_FINANCE_RUNTIME_ESM_IMPORTS_PATCH_OK');
}

main();
