const fs = require('node:fs');
const path = require('node:path');
const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(message) { console.error('STAGE220A36_R11_COMMISSION_MODAL_COMPACT_TOOLTIPS_FAIL:', message); process.exit(1); }
function requireText(text, token, label) { if (!text.includes(token)) fail(label + ' missing token: ' + token); }
function forbidText(text, token, label) { if (text.includes(token)) fail(label + ' forbidden token still present: ' + token); }
const caseDetail = read('src/pages/CaseDetail.tsx');
const css = read('src/styles/closeflow-case-finance-modal-stage220a30.css');
const pkg = JSON.parse(read('package.json'));
requireText(caseDetail, 'data-stage220a36r11-compact-tooltips="true"', 'R11 compact tooltip marker');
requireText(caseDetail, 'case-finance-field-label-with-help-stage220a36r11', 'R11 label help row');
requireText(caseDetail, 'case-finance-help-dot-stage220a36r11', 'R11 tooltip dot');
requireText(caseDetail, '<span>Stawka (%)</span>', 'R11 compact middle label');
requireText(caseDetail, 'title="Aktywne tylko przy prowizji procentowej, np. 2 oznacza 2%."', 'R11 rate tooltip copy');
requireText(caseDetail, 'title="To nie jest prowizja. To kwota sprzedaży, transakcji albo zlecenia, od której liczysz procent."', 'R11 transaction value tooltip copy');
[
  '<small>Wybierz, czy wpisujesz gotową prowizję, czy liczysz ją procentowo.</small>',
  '<small>Aktywne tylko przy procencie.</small>',
  '<small>Stała: wpisujesz. Procent: system wylicza.</small>',
  '<small>To jest podstawa procentu',
].forEach((token) => forbidText(caseDetail, token, 'R11 removes heavy field helper'));
requireText(css, 'STAGE220A36_R11_COMMISSION_MODAL_COMPACT_TOOLTIPS', 'R11 CSS marker');
requireText(css, '.case-finance-edit-form--commission-r11 input', 'R11 compact input CSS');
requireText(css, 'min-height: 2.24rem !important;', 'R11 reduced input height');
requireText(css, '[data-stage220a36r10-top-field="commission-rate"]', 'R11 middle field alignment');
requireText(css, '.case-finance-help-dot-stage220a36r11', 'R11 help dot CSS');
if (pkg.scripts['check:stage220a36r11-commission-modal-compact-tooltips'] !== 'node scripts/check-stage220a36r11-commission-modal-compact-tooltips.cjs') fail('package missing R11 check script');
if (pkg.scripts['test:stage220a36r11-commission-modal-compact-tooltips'] !== 'node --test tests/stage220a36r11-commission-modal-compact-tooltips.test.cjs') fail('package missing R11 test script');
if (!String(pkg.scripts.prebuild || '').includes('node scripts/check-stage220a36r11-commission-modal-compact-tooltips.cjs')) fail('prebuild missing R11 guard');
console.log(JSON.stringify({ ok: true, stage: 'STAGE220A36_R11_COMMISSION_MODAL_COMPACT_TOOLTIPS', guard: 'check:stage220a36r11-commission-modal-compact-tooltips' }, null, 2));
