const fs = require('fs');
const path = require('path');

const root = process.cwd();
const cssPath = path.join(root, 'src/styles/stage216m-r2-client-detail-card-1to1.css');
const adaptersPath = path.join(root, 'src/styles/page-adapters/page-adapters.css');

function fail(message) {
  console.error(`FAIL stage216m-r2-client-detail-card-1to1-contract: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(cssPath)) fail('missing CSS file');
const css = fs.readFileSync(cssPath, 'utf8');
const adapters = fs.existsSync(adaptersPath) ? fs.readFileSync(adaptersPath, 'utf8') : '';

const requiredCss = [
  'STAGE216M_R2_CLIENT_DETAIL_CARD_1TO1',
  'grid-template-columns: 300px minmax(0, 1fr) 310px',
  'grid-template-areas:',
  '.client-detail-vnext-page .client-detail-header',
  '.client-detail-vnext-page .client-detail-profile-card',
  '.client-detail-vnext-page .client-detail-edit-main-button',
  '.client-detail-vnext-page .client-detail-info-row',
  '.client-detail-vnext-page .client-detail-info-icon',
  'display: none !important',
  'border-radius: 28px !important',
];

for (const token of requiredCss) {
  if (!css.includes(token)) fail(`missing token in CSS: ${token}`);
}

if (css.includes('--stage216m-page-max: 1108px')) fail('R2 must not reintroduce 1108px fixed page width');
if (!adapters.includes("@import '../stage216m-r2-client-detail-card-1to1.css';")) {
  fail('page-adapters.css does not import Stage216M-R2 CSS');
}

console.log('PASS stage216m-r2-client-detail-card-1to1-contract');
