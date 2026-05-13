const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const root = path.resolve(__dirname, '..');
function read(p) { return fs.readFileSync(path.join(root, p), 'utf8'); }

test('FIN-14 action buttons expose deposit, partial and commission actions', () => {
  const source = read('src/components/finance/CaseFinanceActionButtons.tsx');
  assert.match(source, /Dodaj zaliczkę/);
  assert.match(source, /Dodaj wpłatę/);
  assert.match(source, /Dodaj płatność prowizji/);
  assert.match(source, /onAddDepositPayment/);
});

test('FIN-14 shared payment dialog writes case payment payload', () => {
  const source = read('src/components/finance/CaseFinancePaymentDialog.tsx');
  assert.match(source, /defaultType: 'deposit' \| 'partial' \| 'commission'/);
  assert.match(source, /caseId: caseId \|\| null/);
  assert.match(source, /type: normalizePaymentType\(type\)/);
  assert.match(source, /amount: parsedAmount/);
});

test('FIN-14 payment list labels separate customer payment, deposit and commission', () => {
  const source = read('src/components/finance/PaymentList.tsx');
  assert.match(source, /Wpłata klienta/);
  assert.match(source, /Zaliczka/);
  assert.match(source, /Prowizja/);
});

test('FIN-14 client finance view no longer keeps local reduce in component', () => {
  const source = read('src/components/finance/FinanceMiniSummary.tsx');
  assert.doesNotMatch(source, /\.reduce\s*\(/);
  assert.match(source, /CaseFinancePaymentDialog/);
  assert.match(source, /setPaymentType\('commission'\)/);
});
