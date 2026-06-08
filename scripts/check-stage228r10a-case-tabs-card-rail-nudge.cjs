const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function fail(message) {
  console.error('STAGE228R10A_CASE_TABS_CARD_RAIL_NUDGE_FAIL:', message);
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
].forEach((token) => requireText(caseDetail, token, 'CaseDetail R9R2 baseline'));

[
  'STAGE228R10A_CASE_TABS_CARD_AND_RAIL_NUDGE',
  '.case-detail-main-column[data-stage228r9-main-column="true"] > .case-detail-stage228r9-tabs-compact',
  'background: rgba(255, 255, 255, 0.96) !important;',
  'border: 1px solid rgba(226, 232, 240, 0.98) !important;',
  'border-radius: 22px !important;',
  'display: flex !important;',
  'justify-content: center !important;',
  'width: 100% !important;',
  'min-height: 46px !important;',
  '.case-detail-stage228r9-shell .case-detail-right-rail',
  'margin-top: -12px !important;',
  'top: 10px !important;',
].forEach((token) => requireText(css, token, 'Stage228R10A CSS'));

[
  'STAGE228R9_R3_CASE_DETAIL_LEFT_HEADER_RAIL_TOP_GRID',
  'display: contents !important;',
].forEach((token) => forbidText(css, token, 'Broken R9R3/R9R4 CSS'));

if (pkg.scripts['check:stage228r10a-case-tabs-card-rail-nudge'] !== 'node scripts/check-stage228r10a-case-tabs-card-rail-nudge.cjs') {
  fail('package.json missing check:stage228r10a-case-tabs-card-rail-nudge script');
}

if (!String(pkg.scripts.prebuild || '').includes('node scripts/check-stage228r10a-case-tabs-card-rail-nudge.cjs')) {
  fail('package.json prebuild missing Stage228R10A guard');
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R10A_CASE_TABS_CARD_AND_RAIL_NUDGE',
  contract: 'tabs are centered in a left-column card and right rail is nudged upward without page-grid rewrite'
}, null, 2));
