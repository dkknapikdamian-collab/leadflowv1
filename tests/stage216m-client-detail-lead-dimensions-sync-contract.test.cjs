const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const cssPath = path.join(root, 'src/styles/stage216m-client-detail-lead-dimensions-sync.css');
const adaptersPath = path.join(root, 'src/styles/page-adapters/page-adapters.css');
const clientPath = path.join(root, 'src/pages/ClientDetail.tsx');

function fail(message) {
  console.error(`FAIL stage216m-client-detail-lead-dimensions-sync-contract: ${message}`);
  process.exit(1);
}

for (const file of [cssPath, adaptersPath, clientPath]) {
  if (!fs.existsSync(file)) fail(`missing file ${path.relative(root, file)}`);
}

const css = fs.readFileSync(cssPath, 'utf8');
const adapters = fs.readFileSync(adaptersPath, 'utf8');
const client = fs.readFileSync(clientPath, 'utf8');

[
  'STAGE216M_CLIENT_DETAIL_LEAD_DIMENSIONS_SYNC',
  '--stage216m-page-max: 1108px',
  'grid-template-columns: var(--stage216m-left) minmax(0, var(--stage216m-center)) var(--stage216m-right) !important',
  '.client-detail-left-rail > .client-detail-today-info-tiles',
  '.client-detail-main-top-tiles',
  '.client-detail-case-smart-card',
].forEach((needle) => {
  if (!css.includes(needle)) fail(`css missing ${needle}`);
});

if (!adapters.includes("@import '../stage216l-client-detail-lead-layout-cumulative.css';")) {
  fail('Stage216L import missing');
}
if (!adapters.includes("@import '../stage216m-client-detail-lead-dimensions-sync.css';")) {
  fail('Stage216M import missing');
}
if (adapters.indexOf("stage216m-client-detail-lead-dimensions-sync.css") < adapters.indexOf("stage216l-client-detail-lead-layout-cumulative.css")) {
  fail('Stage216M import must be after Stage216L');
}

[
  'data-stage216l-client-top-tiles-in-main-column',
  'data-stage216l-client-notes-center',
  'data-stage216l-client-avatar-removed',
].forEach((needle) => {
  if (!client.includes(needle)) fail(`ClientDetail missing prior Stage216L marker ${needle}`);
});

console.log('PASS stage216m-client-detail-lead-dimensions-sync-contract');
