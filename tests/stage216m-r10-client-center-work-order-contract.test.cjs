const fs = require('fs');
const path = require('path');

const root = process.cwd();
const cssPath = path.join(root, 'src/styles/stage216m-r10-client-center-work-order.css');
const adaptersPath = path.join(root, 'src/styles/page-adapters/page-adapters.css');
const clientPath = path.join(root, 'src/pages/ClientDetail.tsx');

function fail(message) {
  console.error(`FAIL stage216m-r10-client-center-work-order-contract: ${message}`);
  process.exit(1);
}

for (const file of [cssPath, adaptersPath, clientPath]) {
  if (!fs.existsSync(file)) fail(`missing file ${path.relative(root, file)}`);
}

const css = fs.readFileSync(cssPath, 'utf8');
const adapters = fs.readFileSync(adaptersPath, 'utf8');
const client = fs.readFileSync(clientPath, 'utf8');

const requiredCssTokens = [
  'STAGE216M_R10_CLIENT_CENTER_WORK_ORDER',
  'data-client-cases-list-panel="true"',
  'data-stage216l-client-notes-center="true"',
  'order: 10',
  'order: 20',
  'order: 30',
  'data-client-case-smart-card="true"',
  '--stage216m-r10-client-center-work-order',
];

for (const token of requiredCssTokens) {
  if (!css.includes(token)) fail(`CSS token missing: ${token}`);
}

if (!adapters.includes("@import '../stage216m-r10-client-center-work-order.css';")) {
  fail('page-adapters.css import missing');
}

const requiredTsxTokens = [
  'data-stage216l-client-top-tiles-in-main-column="true"',
  'data-stage216l-client-notes-center="true"',
  'data-client-cases-list-panel="true"',
  'data-client-case-smart-list="true"',
  'data-client-case-smart-card="true"',
];

for (const token of requiredTsxTokens) {
  if (!client.includes(token)) fail(`ClientDetail token missing: ${token}`);
}

console.log('PASS stage216m-r10-client-center-work-order-contract');
