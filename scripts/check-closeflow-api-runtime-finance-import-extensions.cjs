#!/usr/bin/env node
const fs = require('fs');

let failed = 0;
function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { failed += 1; console.log(`FAIL ${message}`); }
function assertIncludes(file, needle, label) {
  const text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  text.includes(needle) ? pass(`${file}: ${label}`) : fail(`${file}: missing ${label} [needle=${JSON.stringify(needle)}]`);
}
function assertNotIncludes(file, needle, label) {
  const text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  !text.includes(needle) ? pass(`${file}: ${label}`) : fail(`${file}: forbidden ${label} [needle=${JSON.stringify(needle)}]`);
}

assertIncludes('src/lib/data-contract.ts', "from './finance/finance-normalize.js';", 'data-contract imports finance-normalize with .js extension');
assertIncludes('src/lib/finance/finance-normalize.ts', "from './finance-types.js';", 'finance-normalize imports finance-types with .js extension');
assertIncludes('src/lib/finance/finance-normalize.ts', "from './finance-calculations.js';", 'finance-normalize imports finance-calculations with .js extension');
assertIncludes('src/lib/finance/finance-calculations.ts', "from './finance-types.js';", 'finance-calculations imports finance-types with .js extension');

assertNotIncludes('src/lib/finance/finance-normalize.ts', "from './finance-types';", 'finance-normalize no extensionless finance-types runtime import');
assertNotIncludes('src/lib/finance/finance-normalize.ts', "from './finance-calculations';", 'finance-normalize no extensionless finance-calculations runtime import');
assertNotIncludes('src/lib/finance/finance-calculations.ts', "from './finance-types';", 'finance-calculations no extensionless finance-types runtime import');

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8').replace(/^\uFEFF/, ''));
pkg.scripts && pkg.scripts['check:closeflow-api-runtime-finance-import-extensions']
  ? pass('package.json: check script present')
  : fail('package.json: check script missing');

if (failed) {
  console.error(`FAIL CLOSEFLOW_API_RUNTIME_FINANCE_IMPORT_EXTENSIONS_FAILED problem_count=${failed}`);
  process.exit(1);
}
console.log('CLOSEFLOW_API_RUNTIME_FINANCE_IMPORT_EXTENSIONS_OK');
