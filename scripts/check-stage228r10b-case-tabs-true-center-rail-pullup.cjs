const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function fail(message) {
  console.error('STAGE228R10B_CASE_TABS_TRUE_CENTER_RAIL_PULLUP_FAIL:', message);
  process.exit(1);
}

function requireText(text, token, label) {
  if (!text.includes(token)) fail(label + ' missing token: ' + token);
}

function forbidText(text, token, label) {
  if (text.includes(token)) fail(label + ' forbidden token: ' + token);
}

const caseDetail = read('src/pages/CaseDetail.tsx');
const css = read('src/styles/case-detail-stage228r9-shell-rail-lift.css');
const pkg = JSON.parse(read('package.json'));

[
  'data-stage228r9-wide-header="true"',
  'className="case-detail-shell case-detail-stage228r9-shell"',
  'data-stage228r9-shell-rail-lift="true"',
  'data-stage228r9-main-column="true"',
  'case-detail-stage228r9-tabs-compact',
  '<aside className="case-detail-right-rail"',
].forEach((token) => requireText(caseDetail, token, 'CaseDetail R9/R10 baseline'));

[
  'STAGE228R10A_CASE_TABS_CARD_AND_RAIL_NUDGE',
  'STAGE228R10B_CASE_TABS_TRUE_CENTER_AND_RAIL_PULLUP',
  '.case-detail-main-column[data-stage228r9-main-column="true"] > .case-detail-stage228r9-tabs-compact',
  '.case-detail-stage220a10-tabs-wrap.case-detail-stage228r9-tabs-compact',
  'justify-content: center !important;',
  'text-align: center !important;',
  'width: 100% !important;',
  'max-width: max-content !important;',
  'flex: 0 0 auto !important;',
  'margin-top: -42px !important;',
  'top: 4px !important;',
].forEach((token) => requireText(css, token, 'Stage228R10B CSS'));

[
  'STAGE228R9_R3_CASE_DETAIL_LEFT_HEADER_RAIL_TOP_GRID',
  'display: contents !important;',
].forEach((token) => forbidText(css, token, 'Broken R9R3/R9R4 CSS'));

if (pkg.scripts['check:stage228r10b-case-tabs-true-center-rail-pullup'] !== 'node scripts/check-stage228r10b-case-tabs-true-center-rail-pullup.cjs') {
  fail('package.json missing check:stage228r10b-case-tabs-true-center-rail-pullup script');
}

if (!String(pkg.scripts.prebuild || '').includes('node scripts/check-stage228r10b-case-tabs-true-center-rail-pullup.cjs')) {
  fail('package.json prebuild missing Stage228R10B guard');
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R10B_CASE_TABS_TRUE_CENTER_AND_RAIL_PULLUP',
  contract: 'tabs card spans left column, inner tabs are centered and right rail is pulled upward without page-grid rewrite'
}, null, 2));
