const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(message) { console.error('STAGE220A36_R2_COMMISSION_MODAL_FIELD_ORDER_GUARD_FAIL:', message); process.exit(1); }
function requireText(text, token, label) { if (!text.includes(token)) fail(label + ' missing token: ' + token); }
function forbidText(text, token, label) { if (text.includes(token)) fail(label + ' forbidden token still present: ' + token); }

const editor = read('src/components/finance/CaseFinanceEditorDialog.tsx');
const css = read('src/styles/finance/closeflow-finance.css');
const test = read('tests/stage220a36r2-commission-modal-field-order.test.cjs');
const pkg = JSON.parse(read('package.json'));

[
  'data-stage220a36r2-commission-field-order="true"',
  'data-stage220a36r2-commission-grid="true"',
  'Rodzaj prowizji',
  'Stawka prowizji (%)',
  'Wartość prowizji',
  'Podstawa procentu (wartość transakcji/zlecenia)',
  'disabled={!isPercentCommission}',
  'disabled={!isFixedCommission}',
  'readOnly={isPercentCommission}',
  'To nie jest prowizja. To kwota, od której liczysz procent',
].forEach((token) => requireText(editor, token, 'CaseFinanceEditorDialog'));

const ordered = [
  'Rodzaj prowizji',
  'Stawka prowizji (%)',
  'Wartość prowizji',
  'Podstawa procentu (wartość transakcji/zlecenia)',
  'Waluta',
  'Status prowizji',
];
let previous = -1;
for (const token of ordered) {
  const index = editor.indexOf(token);
  if (index === -1) fail('missing ordered field: ' + token);
  if (index <= previous) fail('field order broken at: ' + token);
  previous = index;
}

forbidText(editor, '<span>Wartość transakcji / sprawy</span>', 'old first field label');
forbidText(editor, '<span>Kwota prowizji</span>', 'old amount label');

[
  'STAGE220A36-R2_COMMISSION_MODAL_FIELD_ORDER',
  '.cf-finance-dialog[data-stage220a36r2-commission-field-order="true"]',
  '.cf-finance-editor-grid[data-stage220a36r2-commission-grid="true"]',
  'grid-template-columns: repeat(3, minmax(0, 1fr))',
].forEach((token) => requireText(css, token, 'finance css'));

[
  'field order starts with commission mode, rate and commission amount',
  'basis field is below top commission controls',
].forEach((token) => requireText(test, token, 'runtime/static test'));

if (pkg.scripts['check:stage220a36r2-commission-modal-field-order'] !== 'node scripts/check-stage220a36r2-commission-modal-field-order.cjs') {
  fail('package.json missing check:stage220a36r2-commission-modal-field-order script');
}
if (pkg.scripts['test:stage220a36r2-commission-modal-field-order'] !== 'node --test tests/stage220a36r2-commission-modal-field-order.test.cjs') {
  fail('package.json missing test:stage220a36r2-commission-modal-field-order script');
}
if (!String(pkg.scripts.prebuild || '').includes('node scripts/check-stage220a36r2-commission-modal-field-order.cjs')) {
  fail('prebuild does not include Stage220A36-R2 guard');
}

console.log(JSON.stringify({ ok: true, stage: 'STAGE220A36_R2_COMMISSION_MODAL_FIELD_ORDER', guard: 'check:stage220a36r2-commission-modal-field-order' }, null, 2));
