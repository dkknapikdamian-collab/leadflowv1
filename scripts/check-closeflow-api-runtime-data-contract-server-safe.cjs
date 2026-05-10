const fs = require('fs');

const checks = [];
function pass(label) {
  checks.push({ ok: true, label });
  console.log(`PASS ${label}`);
}
function fail(label) {
  checks.push({ ok: false, label });
  console.error(`FAIL ${label}`);
}

function read(rel) {
  if (!fs.existsSync(rel)) {
    fail(`${rel}: exists`);
    return '';
  }
  pass(`${rel}: exists`);
  return fs.readFileSync(rel, 'utf8');
}

const dataContract = read('src/lib/data-contract.ts');

if (dataContract.includes("from './finance/finance-normalize.js'")) {
  fail('src/lib/data-contract.ts: does not import finance-normalize in server shared contract');
} else {
  pass('src/lib/data-contract.ts: does not import finance-normalize in server shared contract');
}

for (const needle of [
  'DATA_CONTRACT_SERVER_SAFE_FINANCE_NORMALIZERS',
  'DATA_CONTRACT_COMMISSION_MODES',
  'DATA_CONTRACT_COMMISSION_BASES',
  'DATA_CONTRACT_COMMISSION_STATUSES',
  'DATA_CONTRACT_PAYMENT_TYPES',
  'DATA_CONTRACT_PAYMENT_STATUSES',
  'function normalizeCommissionMode(value: unknown)',
  'function normalizeCommissionBase(value: unknown)',
  'function normalizeCommissionStatus(value: unknown)',
  'function normalizePaymentType(value: unknown)',
  'function normalizePaymentStatus(value: unknown)',
  "return normalizeFinanceEnum(value, DATA_CONTRACT_COMMISSION_MODES, 'none');",
  "return normalizeFinanceEnum(value, DATA_CONTRACT_PAYMENT_TYPES, 'other');",
]) {
  if (dataContract.includes(needle)) pass(`src/lib/data-contract.ts: contains ${needle}`);
  else fail(`src/lib/data-contract.ts: missing ${needle}`);
}

const financeNormalize = read('src/lib/finance/finance-normalize.ts');
if (financeNormalize.includes("from './finance-types.js'")) pass('finance-normalize keeps .js finance-types import');
else fail('finance-normalize keeps .js finance-types import');

if (financeNormalize.includes("from './finance-calculations.js'")) pass('finance-normalize keeps .js finance-calculations import');
else fail('finance-normalize keeps .js finance-calculations import');

const packageJson = read('package.json');
try {
  const pkg = JSON.parse(packageJson.replace(/^\uFEFF/, ''));
  if (pkg.scripts && pkg.scripts['check:closeflow-api-runtime-data-contract-server-safe']) {
    pass('package.json: check script present');
  } else {
    fail('package.json: check script present');
  }
} catch (error) {
  fail(`package.json parse: ${error.message}`);
}

const failed = checks.filter((item) => !item.ok);
console.log(`\nSummary: ${checks.length - failed.length} pass, ${failed.length} fail.`);
if (failed.length) {
  console.error('FAIL CLOSEFLOW_API_RUNTIME_DATA_CONTRACT_SERVER_SAFE_FAILED');
  process.exit(1);
}
console.log('CLOSEFLOW_API_RUNTIME_DATA_CONTRACT_SERVER_SAFE_OK');
