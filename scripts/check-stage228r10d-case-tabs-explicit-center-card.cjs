const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function fail(message) {
  console.error('STAGE228R10D_CASE_TABS_EXPLICIT_CENTER_CARD_FAIL:', message);
  process.exit(1);
}

function requireText(text, token, label) {
  if (!text.includes(token)) fail(label + ' missing token: ' + token);
}

function forbidText(text, token, label) {
  if (text.includes(token)) fail(label + ' forbidden token: ' + token);
}

function requireOrder(text, first, second, label) {
  const a = text.indexOf(first);
  const b = text.indexOf(second);
  if (a === -1 || b === -1 || a > b) {
    fail(label + ' order invalid: ' + first + ' must be before ' + second);
  }
}

const caseDetail = read('src/pages/CaseDetail.tsx');
const css = read('src/styles/case-detail-stage228r9-shell-rail-lift.css');
const pkg = JSON.parse(read('package.json'));

[
  'STAGE228R10D_CASE_TABS_EXPLICIT_CENTER_CARD',
  'data-stage228r10d-tabs-card="true"',
  'data-stage228r10d-card-spacing-lock="true"',
  'aria-label="Obsługa, checklisty i historia sprawy"',
  'data-stage228r9-main-column="true"',
  'case-detail-stage228r9-tabs-compact',
  '<aside className="case-detail-right-rail"',
  'Co robimy teraz?',
  'Notatki sprawy',
].forEach((token) => requireText(caseDetail, token, 'CaseDetail explicit tabs card / existing cards'));

requireOrder(
  caseDetail,
  'data-stage228r10d-tabs-card="true"',
  'Co robimy teraz?',
  'Tabs card must stay above the main action card'
);

requireOrder(
  caseDetail,
  'Co robimy teraz?',
  'Notatki sprawy',
  'Main action card must stay above notes card'
);

[
  'STAGE228R10C_CASE_RAIL_FUNNEL_SPACING',
  'STAGE228R10D_CASE_TABS_EXPLICIT_CENTER_CARD',
  '--stage228r10d-case-card-gap: 16px;',
  '--stage228r10d-case-card-radius: 22px;',
  '.case-detail-stage228r10d-tabs-card[data-stage228r10d-tabs-card="true"]',
  'justify-content: center !important;',
  'margin: 0 0 var(--stage228r10d-case-card-gap) !important;',
  'width: 100% !important;',
  'max-width: max-content !important;',
  'flex: 0 0 auto !important;',
  'margin-top: -24px !important;',
  'top: 12px !important;',
].forEach((token) => requireText(css, token, 'Stage228R10D CSS and R10C rail lock'));

requireOrder(
  css,
  'STAGE228R10C_CASE_RAIL_FUNNEL_SPACING',
  'STAGE228R10D_CASE_TABS_EXPLICIT_CENTER_CARD',
  'R10D tabs card override must appear after R10C rail spacing block'
);

// R10D must not move the rail. It only protects the R10C final rail offset.
const r10dIndex = css.indexOf('STAGE228R10D_CASE_TABS_EXPLICIT_CENTER_CARD');
const r10dTail = css.slice(r10dIndex);
if (r10dTail.includes('case-detail-right-rail')) {
  fail('R10D block must not contain case-detail-right-rail selector; rail position is locked by R10C.');
}

[
  'STAGE228R9_R3_CASE_DETAIL_LEFT_HEADER_RAIL_TOP_GRID',
  'display: contents !important;',
].forEach((token) => forbidText(css, token, 'Broken R9R3/R9R4 CSS'));

if (pkg.scripts['check:stage228r10d-case-tabs-explicit-center-card'] !== 'node scripts/check-stage228r10d-case-tabs-explicit-center-card.cjs') {
  fail('package.json missing check:stage228r10d-case-tabs-explicit-center-card script');
}

if (!String(pkg.scripts.prebuild || '').includes('node scripts/check-stage228r10d-case-tabs-explicit-center-card.cjs')) {
  fail('package.json prebuild missing Stage228R10D guard');
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R10D_CASE_TABS_EXPLICIT_CENTER_CARD',
  contract: 'tabs are wrapped in an explicit card, centered, same card gap is locked, and right rail remains controlled by R10C'
}, null, 2));
