const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = (message) => {
  console.error('ASSERT_FAIL:', message);
  process.exit(1);
};

const read = (rel) => {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) fail('missing file ' + rel);
  return fs.readFileSync(abs, 'utf8');
};

const packageJson = JSON.parse(read('package.json'));
const imports = read('src/styles/page-adapters/page-adapters.css');
const css = read('src/styles/stage40-page-header-action-overflow-hardening.css');
const doc = read('docs/release/CLOSEFLOW_STAGE40_PAGE_HEADER_ACTION_OVERFLOW_HARDENING_2026-05-11.md');
const repairDoc = read('docs/release/CLOSEFLOW_STAGE40_REPAIR2_CHECK_SCRIPT_ESCAPE_FIX_2026-05-11.md');

const requiredCss = [
  'CLOSEFLOW_STAGE40_PAGE_HEADER_ACTION_OVERFLOW_HARDENING',
  '.cf-html-view .page-head',
  '.cf-html-view .head-actions',
  'white-space: nowrap',
  'text-overflow: ellipsis',
  '@media (max-width: 760px)',
  'CSS-only',
  'no business logic'
];

for (const needle of requiredCss) {
  if (!css.includes(needle)) fail('missing css marker: ' + needle);
}

if (!imports.includes("@import '../stage39-page-headers-copy-visual-system.css';")) {
  fail('Stage39 import missing from page-adapters.css');
}

if (!imports.includes("@import '../stage40-page-header-action-overflow-hardening.css';")) {
  fail('Stage40 import missing from page-adapters.css');
}

const script = packageJson?.scripts?.['check:stage40-page-header-action-overflow-hardening'];
if (script !== 'node scripts/check-stage40-page-header-action-overflow-hardening.cjs') {
  fail('missing package script check:stage40-page-header-action-overflow-hardening');
}

const combined = [css, imports, doc, repairDoc].join(String.fromCharCode(10));
for (const forbidden of ['sk-', 'AIza', 'ghp_', 'BEGIN PRIVATE KEY']) {
  if (combined.includes(forbidden)) fail('forbidden secret-like marker present: ' + forbidden);
}

if (!repairDoc.includes('String.fromCharCode(10)')) {
  fail('repair2 evidence missing newline escape fix marker');
}

console.log('CLOSEFLOW_STAGE40_PAGE_HEADER_ACTION_OVERFLOW_HARDENING_OK');
console.log('CLOSEFLOW_STAGE40_REPAIR2_CHECK_SCRIPT_ESCAPE_FIX_OK');
