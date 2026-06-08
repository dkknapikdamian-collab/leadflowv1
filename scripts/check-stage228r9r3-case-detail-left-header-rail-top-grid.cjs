const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function fail(message) {
  console.error('STAGE228R9R3_CASE_DETAIL_LEFT_HEADER_RAIL_TOP_GRID_FAIL:', message);
  process.exit(1);
}

function requireText(text, token, label) {
  if (!text.includes(token)) fail(label + ' missing token: ' + token);
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
  'STAGE228R9_R3_CASE_DETAIL_LEFT_HEADER_RAIL_TOP_GRID',
  'data-stage228r9r3-left-header-rail-top="true"',
  'data-stage228r9r3-right-rail-top="true"',
  'data-stage228r9-main-column="true"',
  'case-detail-stage228r9-tabs-compact',
].forEach((token) => requireText(caseDetail, token, 'CaseDetail'));

requireOrder(
  caseDetail,
  '<header className="case-detail-header client-detail-header"',
  '<div className="case-detail-shell case-detail-stage228r9-shell"',
  'DOM order remains header before shell; CSS grid places header in left column and rail in right column'
);

requireOrder(
  caseDetail,
  '<Tabs value={activeTab}',
  '<aside className="case-detail-right-rail"',
  'Tabs remain before right rail in DOM'
);

[
  'STAGE228R9_R3_CASE_DETAIL_LEFT_HEADER_RAIL_TOP_GRID',
  '.case-detail-vnext-page',
  'display: grid !important;',
  'grid-template-columns: minmax(0, 1fr) 320px !important;',
  '.case-detail-header[data-stage228r9r3-left-header-rail-top="true"]',
  'grid-column: 1 !important;',
  'grid-row: 1 !important;',
  '.case-detail-stage228r9-shell',
  'display: contents !important;',
  '.case-detail-main-column[data-stage228r9-main-column="true"]',
  'grid-row: 2 !important;',
  '.case-detail-right-rail[data-stage228r9r3-right-rail-top="true"]',
  'grid-column: 2 !important;',
  'grid-row: 1 / span 2 !important;',
  'justify-content: center !important;',
].forEach((token) => requireText(css, token, 'Stage228R9R3 CSS'));

// Do not forbid the older R9 wide-header block.
// It remains in the file for compatibility and is intentionally overridden later
// by the more specific R9R3 selector using data-stage228r9r3-left-header-rail-top.

if (pkg.scripts['check:stage228r9r3-case-detail-left-header-rail-top-grid'] !== 'node scripts/check-stage228r9r3-case-detail-left-header-rail-top-grid.cjs') {
  fail('package.json missing check:stage228r9r3-case-detail-left-header-rail-top-grid script');
}

if (!String(pkg.scripts.prebuild || '').includes('node scripts/check-stage228r9r3-case-detail-left-header-rail-top-grid.cjs')) {
  fail('package.json prebuild missing Stage228R9R3 guard');
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R9_R3_CASE_DETAIL_LEFT_HEADER_RAIL_TOP_GRID',
  repair: 'R9R4 guard repair',
  contract: 'CaseDetail header is left-column only, tabs are centered and right rail starts on header row'
}, null, 2));
