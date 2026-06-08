const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function fail(message) {
  console.error('STAGE228R9_CASE_DETAIL_SHELL_RAIL_LIFT_FAIL:', message);
  process.exit(1);
}

function requireText(text, token, label) {
  if (!text.includes(token)) fail(label + ' missing token: ' + token);
}

function forbidRegex(text, regex, label) {
  if (regex.test(text)) fail(label + ' forbidden regex: ' + regex);
}

function requireOrder(text, first, second, label) {
  const a = text.indexOf(first);
  const b = text.indexOf(second);
  if (a === -1 || b === -1 || a > b) fail(label + ' order invalid: ' + first + ' must be before ' + second);
}

const caseDetail = read('src/pages/CaseDetail.tsx');
const css = read('src/styles/case-detail-stage228r9-shell-rail-lift.css');
const pkg = JSON.parse(read('package.json'));

[
  "import '../styles/case-detail-stage228r9-shell-rail-lift.css';",
  'STAGE228R9_CASE_DETAIL_SHELL_WIDTH_RAIL_LIFT',
  'data-stage228r9-wide-header="true"',
  'className="case-detail-shell case-detail-stage228r9-shell"',
  'data-stage228r9-shell-rail-lift="true"',
  'data-stage228r9-main-column="true"',
  'case-detail-stage228r9-tabs-compact',
  'data-stage228r9-tabs-compact="true"',
  '<aside className="case-detail-right-rail"',
].forEach((token) => requireText(caseDetail, token, 'CaseDetail'));

requireOrder(
  caseDetail,
  'className="case-detail-shell case-detail-stage228r9-shell"',
  '<Tabs value={activeTab}',
  'Tabs must live inside shell after Stage228R9'
);

requireOrder(
  caseDetail,
  '<Tabs value={activeTab}',
  '<aside className="case-detail-right-rail"',
  'Tabs remain in main column before right rail'
);

forbidRegex(
  caseDetail,
  /<\/Tabs>\s*<div\s+className="case-detail-shell/,
  'CaseDetail stale full-width tabs above shell'
);

[
  'STAGE228R9_CASE_DETAIL_SHELL_WIDTH_RAIL_LIFT',
  '.case-detail-header[data-stage228r9-wide-header="true"]',
  'max-width: none !important;',
  '.case-detail-stage228r9-shell',
  'grid-template-columns: minmax(0, 1fr) 320px !important;',
  '.case-detail-stage228r9-shell .case-detail-right-rail',
  'position: sticky !important;',
  '.case-detail-stage228r9-tabs-compact',
  'width: auto !important;',
  'border-radius: 999px !important;',
].forEach((token) => requireText(css, token, 'Stage228R9 CSS'));

if (pkg.scripts['check:stage228r9-case-detail-shell-rail-lift'] !== 'node scripts/check-stage228r9-case-detail-shell-rail-lift.cjs') {
  fail('package.json missing check:stage228r9-case-detail-shell-rail-lift script');
}

if (!String(pkg.scripts.prebuild || '').includes('node scripts/check-stage228r9-case-detail-shell-rail-lift.cjs')) {
  fail('package.json prebuild missing Stage228R9 guard');
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R9_CASE_DETAIL_SHELL_WIDTH_RAIL_LIFT',
  repair: 'R9R2 regex anchor fix',
  contract: 'CaseDetail header spans workspace, tabs are compact in main column and right rail starts under header'
}, null, 2));
