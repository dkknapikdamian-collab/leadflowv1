const fs = require('fs');
const path = require('path');

const root = process.cwd();
const cssPath = path.join(root, 'src', 'styles', 'visual-stage10-notifications-vnext.css');
const pagePath = path.join(root, 'src', 'pages', 'NotificationsCenter.tsx');

function fail(message) {
  console.error('STAGE180U_NOTIFICATIONS_METRICS_WIDTH_PARITY_GUARD_FAIL: ' + message);
  process.exit(1);
}

const css = fs.readFileSync(cssPath, 'utf8');
const page = fs.readFileSync(pagePath, 'utf8');

const requiredCss = [
  'STAGE180U_NOTIFICATIONS_METRICS_WIDTH_PARITY',
  '.notifications-vnext-page .notifications-stats-grid,',
  '.notifications-vnext-page .notifications-vnext-shell',
  'width: 100% !important;',
  'max-width: none !important;',
  'grid-template-columns: repeat(4, minmax(0, 1fr)) !important;',
  '.notifications-vnext-page .notifications-stats-grid > *',
  '.notifications-vnext-page .notifications-stats-grid .cf-top-metric-tile-content',
];

for (const item of requiredCss) {
  if (!css.includes(item)) fail('missing CSS contract: ' + item);
}

if (!page.includes('className="notifications-stats-grid"')) {
  fail('NotificationsCenter.tsx must keep notifications-stats-grid on OperatorMetricTiles');
}

if (!page.includes('data-notifications-metric-grid="true"')) {
  fail('Notifications metric grid data marker is missing');
}

console.log('STAGE180U_NOTIFICATIONS_METRICS_WIDTH_PARITY_GUARD_PASS');
