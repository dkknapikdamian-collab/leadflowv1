const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function fail(message) {
  console.error(`CLOSEFLOW_PAYMENTS_NORMALIZE_DATETIME_HOTFIX_CHECK_FAIL: ${message}`);
  process.exit(1);
}

const finance = read('src/lib/finance/finance-normalize.ts');
const payments = read('api/payments.ts');
const pkg = JSON.parse(read('package.json'));

if (!finance.includes('export function normalizeDateTime(')) {
  fail('src/lib/finance/finance-normalize.ts must export normalizeDateTime');
}

if (!finance.includes('normalizeFinanceDate(value)')) {
  fail('normalizeDateTime should reuse normalizeFinanceDate(value) for compatibility');
}

if (!payments.includes("from '../src/lib/finance/finance-normalize.js'")) {
  fail('api/payments.ts must import finance normalizers from finance-normalize.js');
}

if (!payments.includes('normalizeDateTime')) {
  fail('api/payments.ts must import/use normalizeDateTime');
}

for (const needle of ['payload.paid_at = normalizeDateTime', 'payload.due_at = normalizeDateTime']) {
  if (!payments.includes(needle)) {
    fail(`api/payments.ts missing usage: ${needle}`);
  }
}

if (!pkg.scripts || pkg.scripts['check:closeflow-payments-normalize-datetime-hotfix'] !== 'node scripts/check-closeflow-payments-normalize-datetime-hotfix.cjs') {
  fail('package.json missing check:closeflow-payments-normalize-datetime-hotfix script');
}

const docPath = path.join(root, 'docs/bugs/CLOSEFLOW_PAYMENTS_NORMALIZE_DATETIME_HOTFIX_2026-05-11.md');
if (!fs.existsSync(docPath)) {
  fail('missing hotfix documentation');
}

console.log('CLOSEFLOW_PAYMENTS_NORMALIZE_DATETIME_HOTFIX_CHECK_OK');
