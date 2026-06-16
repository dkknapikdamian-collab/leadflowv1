const fs = require('fs');

function fail(message) {
  console.error('STAGE231B0_R15_R3_CLIENT_DETAIL_WIDTH_SOURCE_TRUTH FAIL: ' + message);
  process.exit(1);
}

function read(path) {
  if (!fs.existsSync(path)) fail('missing file: ' + path);
  return fs.readFileSync(path, 'utf8');
}

const client = read('src/pages/ClientDetail.tsx');
const unified = read('src/styles/closeflow-unified-page-canvas-stage211c.css');
const detailCss = read('src/styles/visual-stage12-client-detail-vnext.css');

const requiredClientTokens = [
  'STAGE231B0_R15_R2_CLIENT_DETAIL_SHARED_CANVAS_WIDTH_TRIAL',
  'cf-page-canvas',
  'cf-page-canvas--full',
  'cf-html-view',
  'main-client-detail-html',
  'data-cf-page-canvas="full"',
  'data-stage231b0-r15-r2-client-detail-shared-canvas="true"',
];

for (const token of requiredClientTokens) {
  if (!client.includes(token)) fail('ClientDetail missing token: ' + token);
}

const requiredUnifiedTokens = [
  'STAGE231B0_R15_R2_CLIENT_DETAIL_SHARED_CANVAS_WIDTH_TRIAL',
  '--cf-page-canvas-full-width',
  '--cf-page-canvas-full-max-width',
  '--cf-page-canvas-full-margin-inline',
  '--cf-page-canvas-padding-x',
  '--cf-page-canvas-padding-y',
  '--cf-page-canvas-bottom',
  '--cf-page-canvas-gap',
  '--cf-page-canvas-left-rail',
  '--cf-page-canvas-right-rail',
  '.cf-page-canvas',
  '.cf-page-canvas--full',
  '[data-cf-page-canvas="full"]',
];

for (const token of requiredUnifiedTokens) {
  if (!unified.includes(token)) fail('Unified canvas CSS missing token: ' + token);
}

const requiredDetailTokens = [
  'STAGE231B0_R15_R2_CLIENT_DETAIL_SHARED_CANVAS_WIDTH_TRIAL',
  'main[data-current-section="client-detail"] > .view.active[data-shell-content="true"]',
  '.client-detail-vnext-page[data-stage231b0-r15-r2-client-detail-shared-canvas="true"]',
  '.client-detail-header',
  '.client-detail-shell',
  'var(--cf-page-canvas-full-width)',
  'var(--cf-page-canvas-full-max-width)',
  'var(--cf-page-canvas-padding-x)',
  'var(--cf-page-canvas-left-rail)',
  'var(--cf-page-canvas-right-rail)',
];

for (const token of requiredDetailTokens) {
  if (!detailCss.includes(token)) fail('ClientDetail CSS missing token: ' + token);
}

const obsoleteTokens = [
  'data-stage231b0-r14-client-detail-full-width-lock="true"',
  'cf-client-detail-full-width-stage231b0-r14',
  'STAGE231B0_R14_CLIENT_DETAIL_FULL_WIDTH_LAYOUT_LOCK',
];

for (const token of obsoleteTokens) {
  if (client.includes(token) || detailCss.includes(token) || unified.includes(token)) {
    fail('obsolete R14 token still present: ' + token);
  }
}

const obsoleteFiles = [
  '_project/obsidian_updates/2026-06-10_STAGE231B0_R14_CLIENT_DETAIL_FULL_WIDTH_LAYOUT_LOCK.md',
  '_project/runs/2026-06-10_STAGE231B0_R14_CLIENT_DETAIL_FULL_WIDTH_LAYOUT_LOCK.md',
  'scripts/check-stage231b0-r14-client-detail-full-width-layout-lock.cjs',
  'tests/stage231b0-r14-client-detail-full-width-layout-lock.test.cjs',
];

for (const file of obsoleteFiles) {
  if (fs.existsSync(file)) fail('obsolete R14 file still exists: ' + file);
}

const oldClamp = 'width: min(calc(100vw - 260px), 1760px)';
const oldClampIndex = detailCss.lastIndexOf(oldClamp);
const r15Index = detailCss.lastIndexOf('STAGE231B0_R15_R2_CLIENT_DETAIL_SHARED_CANVAS_WIDTH_TRIAL');

if (oldClampIndex >= 0 && r15Index <= oldClampIndex) {
  fail('R15 shared canvas override must appear after old ClientDetail width clamp');
}

if (/\n\n$/.test(client)) {
  fail('ClientDetail has blank line at EOF');
}

console.log('STAGE231B0_R15_R3_CLIENT_DETAIL_WIDTH_SOURCE_TRUTH PASS');
