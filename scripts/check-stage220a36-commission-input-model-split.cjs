const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(message) { console.error('STAGE220A36_COMMISSION_INPUT_MODEL_SPLIT_GUARD_FAIL:', message); process.exit(1); }
function requireText(text, token, label) { if (!text.includes(token)) fail(label + ' missing token: ' + token); }
function forbidText(text, token, label) { if (text.includes(token)) fail(label + ' forbidden token still present: ' + token); }

const editor = read('src/components/finance/CaseFinanceEditorDialog.tsx');
const clients = read('src/pages/Clients.tsx');
const test = read('tests/stage220a36-commission-input-model-split.test.cjs');
const pkg = JSON.parse(read('package.json'));

[
  'STAGE220A36_COMMISSION_INPUT_MODEL_SPLIT',
  'data-stage220a36-commission-input-model-split="true"',
  'Rodzaj prowizji',
  'Procent od wartości transakcji',
  'Wartość transakcji do wyliczenia prowizji',
  'disabled={!isPercentCommission}',
  'Stawka prowizji (%)',
  'Wartość prowizji',
  'value={calculatedCommissionInputValue}',
  'disabled={!isFixedCommission}',
  'readOnly={isPercentCommission}',
  'contractValue: transactionBasis',
  'expectedRevenue: transactionBasis',
  'Podstawa procentu:',
  'data-stage220a36r2-commission-field-order="true"',
  'Podstawa procentu (wartość transakcji/zlecenia)',
].forEach((token) => requireText(editor, token, 'CaseFinanceEditorDialog'));

forbidText(editor, '<span>Wartość transakcji / sprawy</span>', 'old confusing transaction label');
forbidText(editor, '<span>Model prowizji</span>', 'old model label');
forbidText(editor, '<span>Kwota prowizji</span>', 'old amount label');

[
  'STAGE220A36_CLIENTS_COMMISSION_VALUE_SOURCE',
  'getCaseFinanceSummary(caseRow, []).commissionAmount',
  'const value = getStage220A36CaseCommissionValue(caseRow);',
  'label="Prowizja"',
  'Prowizja: {formatClientMoney(clientValue)}',
  'data-stage220a36-client-commission-value="true"',
  'Najwyższa prowizja',
  '5 klientów z największą prowizją należną.',
].forEach((token) => requireText(clients, token, 'Clients'));

forbidText(clients, '<span className="cf-list-row-value cf-chip-client-value">Wartość: {formatClientMoney(clientValue)}</span>', 'old client row value label');
forbidText(clients, 'title="Najcenniejsi klienci"\n              description="5 klientów z największą wartością."', 'old top value copy');

[
  'fixed commission enters owner revenue directly',
  'percent commission uses transaction basis and locks calculated commission amount',
  'client list operational value uses commission, not transaction price',
].forEach((token) => requireText(test, token, 'runtime test'));

if (pkg.scripts['check:stage220a36-commission-input-model-split'] !== 'node scripts/check-stage220a36-commission-input-model-split.cjs') {
  fail('package.json missing check:stage220a36-commission-input-model-split');
}
if (pkg.scripts['test:stage220a36-commission-input-model-split'] !== 'node --test tests/stage220a36-commission-input-model-split.test.cjs') {
  fail('package.json missing test:stage220a36-commission-input-model-split');
}
if (!String(pkg.scripts.prebuild || '').includes('node scripts/check-stage220a36-commission-input-model-split.cjs')) {
  fail('prebuild does not include Stage220A36 guard');
}

console.log(JSON.stringify({ ok: true, stage: 'STAGE220A36_COMMISSION_INPUT_MODEL_SPLIT', guard: 'check:stage220a36-commission-input-model-split' }, null, 2));
