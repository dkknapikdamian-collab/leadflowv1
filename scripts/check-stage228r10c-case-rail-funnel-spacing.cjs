const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function fail(message) {
  console.error('STAGE228R10C_CASE_RAIL_FUNNEL_SPACING_FAIL:', message);
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
  'data-stage228r9-wide-header="true"',
  'className="case-detail-shell case-detail-stage228r9-shell"',
  'data-stage228r9-shell-rail-lift="true"',
  'data-stage228r9-main-column="true"',
  'case-detail-stage228r9-tabs-compact',
  '<aside className="case-detail-right-rail"',
].forEach((token) => requireText(caseDetail, token, 'CaseDetail R9/R10 baseline'));

[
  'STAGE228R10B_CASE_TABS_TRUE_CENTER_AND_RAIL_PULLUP',
  'STAGE228R10C_CASE_RAIL_FUNNEL_SPACING',
  '.case-detail-stage228r9-shell .case-detail-right-rail',
  'margin-top: -24px !important;',
  'top: 12px !important;',
].forEach((token) => requireText(css, token, 'Stage228R10C CSS'));

requireOrder(
  css,
  'STAGE228R10B_CASE_TABS_TRUE_CENTER_AND_RAIL_PULLUP',
  'STAGE228R10C_CASE_RAIL_FUNNEL_SPACING',
  'R10C final rail spacing override must appear after R10B pull-up block'
);

[
  'STAGE228R9_R3_CASE_DETAIL_LEFT_HEADER_RAIL_TOP_GRID',
  'display: contents !important;',
].forEach((token) => forbidText(css, token, 'Broken R9R3/R9R4 CSS'));

if (pkg.scripts['check:stage228r10c-case-rail-funnel-spacing'] !== 'node scripts/check-stage228r10c-case-rail-funnel-spacing.cjs') {
  fail('package.json missing check:stage228r10c-case-rail-funnel-spacing script');
}

if (!String(pkg.scripts.prebuild || '').includes('node scripts/check-stage228r10c-case-rail-funnel-spacing.cjs')) {
  fail('package.json prebuild missing Stage228R10C guard');
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R10C_CASE_RAIL_FUNNEL_SPACING',
  contract: 'right rail final offset is lower than R10B and closer to funnel card spacing'
}, null, 2));
