const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error('Missing file: ' + rel);
  return fs.readFileSync(full, 'utf8');
}
function fail(message) {
  console.error('STAGE220A35_CLIENT_COMMISSION_FINANCE_GUARD_FAIL:', message);
  process.exit(1);
}
function requireText(text, token, label) {
  if (!text.includes(token)) fail(label + ' missing token: ' + token);
}
function forbidText(text, token, label) {
  if (text.includes(token)) fail(label + ' forbidden token still present: ' + token);
}

const clientDetail = read('src/pages/ClientDetail.tsx');
const editor = read('src/components/finance/CaseFinanceEditorDialog.tsx');
const financeSource = read('src/lib/finance/case-finance-source.ts');
const test = read('tests/stage220a35-client-commission-finance.test.cjs');
const pkg = JSON.parse(read('package.json'));

[
  'STAGE220A35_CLIENT_COMMISSION_FINANCE_SOURCE_TRUTH',
  'data-stage220a35-client-commission-top-tile="true"',
  'data-stage220a35-client-commission-metrics="true"',
  'data-stage220a35-case-card-commission="true"',
  'commissionPaidTotal: financeSummary.commissionPaidAmount',
  'Prowizja należna',
  'Wpłacono prowizji',
  'Do zapłaty prowizji',
  'Wartość transakcji: {transactionValue}',
  'getCaseFinanceSummary(caseRecord, casePayments)',
].forEach((token) => requireText(clientDetail, token, 'ClientDetail'));

forbidText(clientDetail, '<span>Do domknięcia</span>\n            <b>{formatMoneyWithCurrency(unpaidTotal)}</b>', 'ClientTopTiles old transaction remaining display');
forbidText(clientDetail, '<small><span>Suma wpłat</span><strong>{formatMoneyWithCurrency(clientFinanceSummary.paymentsTotal, clientFinance.currency)}</strong></small>', 'right rail old client payments label');
forbidText(clientDetail, '<small>Do domknięcia: {formatMoneyWithCurrency(clientFinanceSummary.remainingTotal, clientFinance.currency)}</small>', 'right hard card old transaction remaining label');

[
  'STAGE220A36_COMMISSION_INPUT_MODEL_SPLIT',
  'Rodzaj prowizji',
  'Wartość transakcji do wyliczenia prowizji',
  'Wartość prowizji',
  'Przy kwocie stałej wpisujesz ją ręcznie. Przy procencie pole pokazuje wyliczoną prowizję i jest nieedytowalne.',
].forEach((token) => requireText(editor, token, 'CaseFinanceEditorDialog'));

[
  'commissionAmount: roundMoney(caseSummaries.reduce((sum, summary) => sum + summary.commissionAmount, 0))',
  'commissionPaidAmount: roundMoney(caseSummaries.reduce((sum, summary) => sum + summary.commissionPaidAmount, 0))',
  'commissionRemainingAmount: roundMoney(caseSummaries.reduce((sum, summary) => sum + summary.commissionRemainingAmount, 0))',
  "commissionMode === 'percent'",
].forEach((token) => requireText(financeSource, token, 'case-finance-source'));

[
  '69000',
  '1380',
  'commissionPaidAmount',
  'commissionRemainingAmount',
  'fixed commission remains independent from transaction value',
].forEach((token) => requireText(test, token, 'runtime test'));

if (pkg.scripts['check:stage220a35-client-commission-finance'] !== 'node scripts/check-stage220a35-client-commission-finance.cjs') {
  fail('package.json missing check:stage220a35-client-commission-finance script');
}
if (pkg.scripts['test:stage220a35-client-commission-finance'] !== 'node --test tests/stage220a35-client-commission-finance.test.cjs') {
  fail('package.json missing test:stage220a35-client-commission-finance script');
}
if (!String(pkg.scripts.prebuild || '').includes('node scripts/check-stage220a35-client-commission-finance.cjs')) {
  fail('package.json prebuild does not include Stage220A35 guard');
}

console.log(JSON.stringify({ ok: true, stage: 'STAGE220A35_CLIENT_COMMISSION_FINANCE_SOURCE_TRUTH', guard: 'check:stage220a35-client-commission-finance' }, null, 2));
