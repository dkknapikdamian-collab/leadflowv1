const fs = require('fs');
const path = require('path');

const root = process.cwd();
const cssPath = path.join(root, 'src/styles/stage216m-r9-client-left-rail-final-lock.css');
const importsPath = path.join(root, 'src/styles/page-adapters/page-adapters.css');

function fail(message) {
  console.error(`FAIL stage216m-r9-client-left-rail-final-lock-contract: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(cssPath)) fail('missing CSS file');
if (!fs.existsSync(importsPath)) fail('missing page adapters file');

const css = fs.readFileSync(cssPath, 'utf8');
const imports = fs.readFileSync(importsPath, 'utf8');

const requiredCss = [
  'STAGE216M_R9_CLIENT_LEFT_RAIL_FINAL_LOCK',
  '--cf-entity-left-rail-client-final-nudge-y: -36px',
  '.client-detail-vnext-page .client-detail-left-rail',
  'data-stage216m-r8-client-activity-history-source',
  'Historia aktywnosci',
  'data-stage216m-r9-client-left-rail-final-lock-marker',
];

for (const token of requiredCss) {
  if (!css.includes(token)) fail(`CSS token missing: ${token}`);
}

if (!imports.includes("@import '../stage216m-r9-client-left-rail-final-lock.css';")) {
  fail('page-adapters import missing');
}

console.log('PASS stage216m-r9-client-left-rail-final-lock-contract');
