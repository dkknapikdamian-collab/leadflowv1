const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const root = path.resolve(__dirname, '..');
function read(p) { return fs.readFileSync(path.join(root, p), 'utf8'); }

test('FIN-14 exposes three payment type actions', () => {
  const buttons = read('src/components/finance/CaseFinanceActionButtons.tsx');
  assert.match(buttons, /Dodaj zaliczk\u0119/);
  assert.match(buttons, /Dodaj wp\u0142at\u0119/);
  assert.match(buttons, /Dodaj p\u0142atno\u015B\u0107 prowizji/);
});

test('FIN-14 payment dialog builds complete payment payload', () => {
  const dialog = read('src/components/finance/CaseFinancePaymentDialog.tsx');
  assert.match(dialog, /caseId/);
  assert.match(dialog, /clientId/);
  assert.match(dialog, /leadId/);
  assert.match(dialog, /type: safeType/);
  assert.match(dialog, /paidAt: fromDateTimeLocal\(paidAt\)/);
  assert.match(dialog, /dueAt: fromDateTimeLocal\(dueAt\)/);
});

test('FIN-14 keeps customer payments and commission payments separate', () => {
  const source = read('src/lib/finance/case-finance-source.ts');
  assert.match(source, /paymentType\(payment\) !== 'commission'/);
  assert.match(source, /paymentType\(payment\) === 'commission'/);
});
