const fs = require('fs');

const checks = [];
function pass(label) { checks.push({ ok: true, label }); console.log('PASS ' + label); }
function fail(label) { checks.push({ ok: false, label }); console.error('FAIL ' + label); }
function read(rel) {
  if (!fs.existsSync(rel)) { fail(rel + ': exists'); return ''; }
  pass(rel + ': exists');
  return fs.readFileSync(rel, 'utf8');
}
function must(text, needle, label) {
  if (text.includes(needle)) pass(label);
  else fail(label + ' [needle=' + needle + ']');
}
function mustNot(text, needle, label) {
  if (!text.includes(needle)) pass(label);
  else fail(label + ' [forbidden=' + needle + ']');
}

const packageJson = JSON.parse(read('package.json').replace(/^\uFEFF/, ''));
const scripts = packageJson.scripts || {};
for (const scriptName of [
  'verify:closeflow-finance',
  'check:closeflow-finance-contract',
  'check:closeflow-finance-ui-contract',
  'check:closeflow-finance-payment-types',
  'check:closeflow-finance-duplicate-safety',
  'check:closeflow-case-settlement-panel',
  'check:closeflow-fin6-payments-list-types',
  'check:closeflow-fin7-client-finance-summary',
  'check:closeflow-fin8-finance-visual-integration',
  'check:closeflow-fin9-finance-duplicate-safety',
]) {
  if (scripts[scriptName]) pass('package.json script present: ' + scriptName);
  else fail('package.json script missing: ' + scriptName);
}

for (const rel of [
  'src/lib/finance/finance-types.ts',
  'src/lib/finance/finance-calculations.ts',
  'src/lib/finance/finance-normalize.ts',
  'src/lib/finance/finance-payment-labels.ts',
  'src/lib/finance/finance-client-summary.ts',
  'src/lib/finance/finance-duplicate-safety.ts',
]) {
  read(rel);
}

const labels = read('src/lib/finance/finance-payment-labels.ts');
must(labels, 'FIN-6_PAYMENTS_LIST_AND_PAYMENT_TYPES_V1', 'FIN-6 payment type contract marker');
must(labels, 'PAYMENT_TYPE_OPTIONS', 'payment type options source of truth');
must(labels, 'PAYMENT_STATUS_OPTIONS', 'payment status options source of truth');

const clientSummary = read('src/lib/finance/finance-client-summary.ts');
must(clientSummary, 'buildClientFinanceSummary', 'FIN-7 client finance summary builder');
must(clientSummary, 'contractValue', 'FIN-7 summary tracks contract value');
must(clientSummary, 'commissionAmount', 'FIN-7 summary tracks commission amount');
must(clientSummary, 'paidAmount', 'FIN-7 summary tracks paid amount');
must(clientSummary, 'remainingAmount', 'FIN-7 summary tracks remaining amount');
must(clientSummary, "type !== 'commission'", 'FIN-7 excludes commission payments from client paid amount');

const duplicateSafety = read('src/lib/finance/finance-duplicate-safety.ts');
must(duplicateSafety, 'CLOSEFLOW_FIN9_FINANCE_DUPLICATE_SAFETY_V1', 'FIN-9 duplicate safety contract marker');
must(duplicateSafety, 'FINANCE_DUPLICATE_PAYMENT_WARNING_COPY', 'FIN-9 duplicate warning copy exported');
must(duplicateSafety, 'buildFinanceDuplicateCandidatesFromRecord', 'FIN-9 duplicate candidates from record');
must(duplicateSafety, 'buildFinanceDuplicateCandidatesFromRows', 'FIN-9 duplicate candidates from rows');
must(duplicateSafety, "'lead' | 'client' | 'case'", 'FIN-9 duplicate entity types include case');

const dataContract = read('src/lib/data-contract.ts');
mustNot(dataContract, "from './finance/finance-normalize", 'server data-contract does not import finance-normalize');
must(dataContract, 'DATA_CONTRACT_SERVER_SAFE_FINANCE_NORMALIZERS', 'server-safe finance normalizers marker');
must(dataContract, 'normalizePaymentType', 'data contract normalizes payment type');
must(dataContract, 'normalizePaymentStatus', 'data contract normalizes payment status');
must(dataContract, 'normalizeCommissionStatus', 'data contract normalizes commission status');

const apiPayments = read('api/payments.ts');
must(apiPayments, 'FIN-2_DATABASE_API_FINANCE_CONTRACT_V1', 'payments API keeps FIN-2 contract marker');
must(apiPayments, 'FIN-6_PAYMENTS_LIST_AND_PAYMENT_TYPES_API_PARITY_V1', 'payments API keeps FIN-6 parity marker');
must(apiPayments, 'normalizePaymentType', 'payments API normalizes payment type');
must(apiPayments, 'normalizePaymentStatus', 'payments API normalizes payment status');

const serverPayments = read('src/server/payments.ts');
for (const needle of ['deposit', 'partial', 'final', 'commission', 'refund', 'other', 'planned', 'due', 'paid', 'cancelled']) {
  must(serverPayments, needle, 'server payments accepts ' + needle);
}
mustNot(serverPayments, 'recurring', 'server payments does not use legacy recurring payment type');
mustNot(serverPayments, 'manual', 'server payments does not use legacy manual payment type');

const apiSystem = read('api/system.ts');
must(apiSystem, 'API0_VERCEL_HOBBY_DIGEST_CONSOLIDATION', 'API-0 system consolidation remains');
must(apiSystem, 'CLOSEFLOW_FIN9_API_SYSTEM_DUPLICATE_SAFETY_MARKER', 'FIN-9 system marker remains');

const evidence = read('docs/finance/CLOSEFLOW_FINANCE_RELEASE_EVIDENCE_2026-05-09.md');
must(evidence, 'CLOSEFLOW_FINANCE_RELEASE_EVIDENCE', 'FIN-10 release evidence marker');
must(evidence, 'verify:closeflow-finance', 'release evidence documents verification command');
for (const stage of ['FIN-5', 'FIN-6', 'FIN-7', 'FIN-8', 'FIN-9', 'FIN-10']) {
  must(evidence, stage, 'release evidence mentions ' + stage);
}

const failed = checks.filter((item) => !item.ok);
console.log('\nSummary: ' + (checks.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('FAIL CLOSEFLOW_FINANCE_CONTRACT_FAILED');
  process.exit(1);
}
console.log('CLOSEFLOW_FINANCE_CONTRACT_OK');
