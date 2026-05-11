const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = (message) => {
  console.error('ASSERT_FAIL:', message);
  process.exit(1);
};

const read = (rel) => {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) fail(`missing file ${rel}`);
  return fs.readFileSync(abs, 'utf8');
};

const packageJson = JSON.parse(read('package.json'));
const css = read('src/styles/stage39-page-headers-copy-visual-system.css');
const imports = read('src/styles/page-adapters/page-adapters.css');
const doc = read('docs/release/CLOSEFLOW_STAGE39_PAGE_HEADERS_COPY_VISUAL_SYSTEM_2026-05-11.md');

const requiredCss = [
  'CLOSEFLOW_STAGE39_PAGE_HEADERS_COPY_VISUAL_SYSTEM',
  '.cf-html-view .page-head',
  '.cf-html-view .page-head h1',
  '.cf-html-view .head-actions',
  'no landing-page hero'
];

for (const needle of requiredCss) {
  if (!css.includes(needle)) fail(`missing css marker: ${needle}`);
}

if (!imports.includes("@import '../stage39-page-headers-copy-visual-system.css';")) {
  fail('stage39 stylesheet is not imported from page-adapters.css');
}

const script = packageJson?.scripts?.['check:stage39-page-headers-copy-visual-system'];
if (script !== 'node scripts/check-stage39-page-headers-copy-visual-system.cjs') {
  fail('missing package script check:stage39-page-headers-copy-visual-system');
}

for (const forbidden of ['sk-', 'AIza', 'ghp_', 'BEGIN PRIVATE KEY']) {
  const combined = [css, imports, doc].join('\n');
  if (combined.includes(forbidden)) fail(`forbidden secret-like marker present: ${forbidden}`);
}

console.log('CLOSEFLOW_STAGE39_PAGE_HEADERS_COPY_VISUAL_SYSTEM_OK');
