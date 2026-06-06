const fs = require('node:fs');
function fail(message) { console.error('STAGE220A36_R12_COMMISSION_MODAL_WIDTH_POLISH_FAIL:', message); process.exit(1); }
function read(path) { return fs.readFileSync(path, 'utf8'); }
function requireText(text, token, label) { if (!text.includes(token)) fail(label + ' missing token: ' + token); }
const caseDetail = read('src/pages/CaseDetail.tsx');
const css = read('src/styles/closeflow-case-finance-modal-stage220a30.css');
const pkg = JSON.parse(read('package.json'));
requireText(caseDetail, 'data-stage220a36r12-compact-width-polish="true"', 'R12 CaseDetail marker');
requireText(css, 'STAGE220A36_R12_COMMISSION_MODAL_WIDTH_POLISH', 'R12 CSS marker');
requireText(css, 'grid-template-columns: minmax(270px, 1.75fr) minmax(112px, 0.62fr) minmax(155px, 0.88fr)', 'R12 top row grid');
requireText(css, '[data-stage220a36r10-top-field="commission-mode"]', 'R12 commission mode width target');
requireText(css, 'max-width: 128px', 'R12 compact rate width');
requireText(css, 'width: min(100%, 30rem)', 'R12 transaction field max width');
if (pkg.scripts['check:stage220a36r12-commission-modal-width-polish'] !== 'node scripts/check-stage220a36r12-commission-modal-width-polish.cjs') fail('package missing R12 check script');
if (pkg.scripts['test:stage220a36r12-commission-modal-width-polish'] !== 'node --test tests/stage220a36r12-commission-modal-width-polish.test.cjs') fail('package missing R12 test script');
if (!String(pkg.scripts.prebuild || '').includes('node scripts/check-stage220a36r12-commission-modal-width-polish.cjs')) fail('prebuild missing R12 guard');
console.log(JSON.stringify({ ok: true, stage: 'STAGE220A36_R12_COMMISSION_MODAL_WIDTH_POLISH', guard: 'check:stage220a36r12-commission-modal-width-polish' }, null, 2));
