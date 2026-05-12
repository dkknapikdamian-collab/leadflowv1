const fs = require('fs');
const path = require('path');

const root = process.cwd();
const cssPath = path.join(root, 'src/styles/visual-stage12-client-detail-vnext.css');
const tsxPath = path.join(root, 'src/pages/ClientDetail.tsx');

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`Brak pliku: ${path.relative(root, file)}`);
  return fs.readFileSync(file, 'utf8');
}

const css = read(cssPath);
const tsx = read(tsxPath);

const requiredCss = [
  'CLOSEFLOW_CLIENT_DETAIL_NEXT_ACTION_TILE_POLISH_2026_05_12_START',
  '.client-detail-top-cards-side',
  'grid-template-rows: auto auto',
  '.client-detail-summary-card:first-child',
  'min-height: 156px',
  'overflow: visible',
  'overflow-wrap: anywhere',
  'white-space: normal',
  'width: fit-content',
  'CLOSEFLOW_CLIENT_DETAIL_NEXT_ACTION_TILE_POLISH_2026_05_12_END',
];

for (const token of requiredCss) {
  if (!css.includes(token)) fail(`CSS nie zawiera wymaganego tokenu: ${token}`);
}

if (!tsx.includes('nextActionToneClass(clientNextAction.tone)')) {
  fail('ClientDetail nie zawiera kafelka opartego o nextActionToneClass(clientNextAction.tone).');
}

const hasPreciseClass = tsx.includes('client-detail-next-action-tile-polish');
const hasFallbackSelector = css.includes('.client-detail-top-cards-side > .client-detail-summary-card:first-child');
if (!hasPreciseClass && !hasFallbackSelector) {
  fail('Brak precyzyjnej klasy i brak fallback selector dla kafelka najbliĹĽszej akcji.');
}

console.log('OK: client detail next action tile polish guard passed');