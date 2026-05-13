const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const root = path.resolve(__dirname, '..');
function read(p) { return fs.readFileSync(path.join(root, p), 'utf8'); }

test('FIN-13 creates shared case finance editor and actions', () => {
  const dialog = read('src/components/finance/CaseFinanceEditorDialog.tsx');
  const buttons = read('src/components/finance/CaseFinanceActionButtons.tsx');
  assert.match(dialog, /export function CaseFinanceEditorDialog/);
  assert.match(dialog, /onSave: \(patch: CaseFinancePatch\) => Promise<void>/);
  assert.match(buttons, /export function CaseFinanceActionButtons/);
});

test('FIN-13 parser supports Polish finance number formats', () => {
  const dialog = read('src/components/finance/CaseFinanceEditorDialog.tsx');
  assert.match(dialog, /replace\(\/\\\.\/g, ''\)\.replace\(',', '\\.'\)/);
  assert.match(dialog, /lastGroupLooksThousands/);
  assert.match(dialog, /new Intl\.NumberFormat\('pl-PL'/);
});

test('FIN-13 client finances are grouped by caseId and never independent client balance', () => {
  const source = read('src/components/finance/FinanceMiniSummary.tsx');
  assert.match(source, /getPaymentCaseId/);
  assert.match(source, /getCaseFinanceSummary\(caseRecord, casePayments\)/);
  assert.match(source, /caseId: row\.caseId/);
  assert.doesNotMatch(source, /clientBalance|clientSaldo|clientFinanceModel/);
});

test('FIN-13 ClientDetail keeps cases before summary', () => {
  const source = read('src/pages/ClientDetail.tsx');
  const casesIndex = source.indexOf("'cases'");
  const summaryIndex = source.indexOf("'summary'");
  assert.ok(casesIndex >= 0);
  assert.ok(summaryIndex >= 0);
  assert.ok(casesIndex < summaryIndex);
});
