const fs = require('fs');

function fail(message) {
  console.error('STAGE231B0_R15_R2_CLIENT_DETAIL_SHARED_CANVAS_WIDTH FAIL: ' + message);
  process.exit(1);
}

const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const unified = fs.readFileSync('src/styles/closeflow-unified-page-canvas-stage211c.css', 'utf8');
const detailCss = fs.readFileSync('src/styles/visual-stage12-client-detail-vnext.css', 'utf8');

const clientTokens = [
  'STAGE231B0_R15_R2_CLIENT_DETAIL_SHARED_CANVAS_WIDTH_TRIAL',
  'cf-page-canvas',
  'cf-page-canvas--full',
  'main-client-detail-html',
  'data-cf-page-canvas="full"',
  'data-stage231b0-r15-r2-client-detail-shared-canvas="true"',
];

for (const token of clientTokens) {
  if (!client.includes(token)) fail('ClientDetail missing token: ' + token);
}

const unifiedTokens = [
  'STAGE231B0_R15_R2_CLIENT_DETAIL_SHARED_CANVAS_WIDTH_TRIAL',
  '--cf-page-canvas-full-width',
  '--cf-page-canvas-full-max-width',
  '--cf-page-canvas-padding-x',
  '.cf-page-canvas',
  '[data-cf-page-canvas="full"]',
];

for (const token of unifiedTokens) {
  if (!unified.includes(token)) fail('Unified canvas CSS missing token: ' + token);
}

const detailTokens = [
  'STAGE231B0_R15_R2_CLIENT_DETAIL_SHARED_CANVAS_WIDTH_TRIAL',
  'main[data-current-section="client-detail"] > .view.active[data-shell-content="true"]',
  '.client-detail-vnext-page[data-stage231b0-r15-r2-client-detail-shared-canvas="true"]',
  '.client-detail-header',
  '.client-detail-shell',
  'var(--cf-page-canvas-full-width)',
  'var(--cf-page-canvas-full-max-width)',
];

for (const token of detailTokens) {
  if (!detailCss.includes(token)) fail('ClientDetail CSS missing token: ' + token);
}

const forbidden = [
  'data-stage231b0-r14-client-detail-full-width-lock="true"',
  'cf-client-detail-full-width-stage231b0-r14',
  'STAGE231B0_R14_CLIENT_DETAIL_FULL_WIDTH_LAYOUT_LOCK',
];

for (const token of forbidden) {
  if (client.includes(token) || detailCss.includes(token)) {
    fail('obsolete R14 token still present: ' + token);
  }
}

console.log('STAGE231B0_R15_R2_CLIENT_DETAIL_SHARED_CANVAS_WIDTH PASS');
